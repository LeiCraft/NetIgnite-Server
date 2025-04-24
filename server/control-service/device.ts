import { EncodingUtils } from "~/shared/encoding";

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

    public async sendWakeup(macAddress: string) {
        if (!this.isOnline()) {
            return false;
        }

        const payload = EncodingUtils.toHex(ControllableDevice.Commands.WAKEUP + ":" + macAddress);

        this.socket.send(payload);

        return true;
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
    export enum Commands {
        WAKEUP = "WAKEUP"
    }
}

