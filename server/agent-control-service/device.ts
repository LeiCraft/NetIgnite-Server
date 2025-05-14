import { EncodingUtils } from "~/shared/encoding";
import WebSocket from "crossws/websocket";
import { AgentCMDRegistry } from "./commands/registry";
import { AgentCommand } from "./commands/message";
import { ControlService } from ".";

export type DeviceID = string;
export type DevicesDB = Map<DeviceID, ControllableDevice>;

type ControllableOnlineDevice = ControllableDevice & {
    peerID: string;
    socket: WebSocket;
}


export class ControllableDevice implements ControllableDevice.IConfig {

    public peerID: string | null = null;
    public socket: WebSocket | null = null;

    constructor(
        readonly id: string,
        readonly name: string,
        readonly secret: string,
    ) { }

    static fromConfig(config: ControllableDevice.IConfig) {
        return new ControllableDevice(
            config.id,
            config.name,
            config.secret
        );
    }

    public isOnline(): this is ControllableOnlineDevice {
        return this.socket !== null && this.peerID !== null && this.socket.readyState === WebSocket.OPEN;
    }

    async sendCommand<C extends AgentCMDRegistry.Commands>(
        command: C,
        payload: AgentCMDRegistry.Payload<C>
    ): Promise<AgentCMDRegistry.Response<C> | null> {
        if (!this.isOnline()) {
            return null;
        }

        const cmd = AgentCommand.create(command as any, payload as any);
        const response_id = cmd.id;

        this.socket.send(cmd.encodeToHex());

        return new Promise<AgentCMDRegistry.Response<C> | null>((resolve) => {
            const onMessage = (event: MessageEvent) => {

                const data = event.data as ArrayBuffer | Uint8Array | Buffer
                
                
                const decoded = AgentCommand.fromDecodedHex(Buffer.from(data as any));
                if (decoded && decoded.id === response_id) {
                    clearTimeout(timeout);
                    this.socket?.removeEventListener("message", onMessage);
                    resolve(decoded as any);
                }
            };

            const timeout = setTimeout(() => {
                this.socket?.removeEventListener("message", onMessage);
                resolve(null);
            }, 5000);

            this.socket.addEventListener("message", onMessage);
        });


    }

    async closeConnection() {
        if (this.isOnline()) {
            const clients = await ControlService.getClients();
            clients.delete(this.peerID as string);

            (this.peerID as any) = null;
            (this.socket as any) = null;
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

