import { EncodingUtils } from "~/shared/encoding";
import WebSocket from "crossws/websocket";
import { AgentCMDRegistry } from "./commands/registry";
import { AgentCommand } from "./commands/message";

export type DeviceID = string;
export type DevicesDB = Map<DeviceID, ControllableDevice>;

type ControllableOnlineDevice = ControllableDevice & {
    socket: WebSocket;
}


export class ControllableDevice implements ControllableDevice.IConfig {

    public socket: WebSocket | null = null;

    constructor(
        readonly id: string,
        readonly name: string,
        readonly secret: string,
    ) {}

    static fromConfig(config: ControllableDevice.IConfig) {
        return new ControllableDevice(
            config.id,
            config.name,
            config.secret
        );
    }

    public isOnline(): this is ControllableOnlineDevice {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }

    async sendCommand<C extends AgentCMDRegistry.Commands> (
        command: C,
        payload: AgentCMDRegistry.Payload<C>
    ) {
        if (!this.isOnline()) {
            return null;
        }

        const cmd = AgentCommand.create(command as any, payload as any);
        const response_id = cmd.id;

        this.socket.send(cmd.encodeToHex());

        return new Promise<AgentCMDRegistry.Response<C> | null>((resolve) => {
            const onMessage = (event: MessageEvent) => {

                const data = event.data;
                
                if (data instanceof ArrayBuffer) {
                    const decoded = AgentCommand.fromDecodedHex(data);
                    if (decoded && decoded.id === response_id) {
                        this.socket?.removeEventListener("message", onMessage);
                        resolve(decoded as any);
                    }
                }
            };

            this.socket.addEventListener("message", onMessage);
        });

    }

    public close() {
        if (this.isOnline()) {
            this.socket.close();
        }
    }

}

export namespace ControllableDevice {
    export interface IConfig {
        id: DeviceID;
        name: string;
        secret: string;
    }
}

