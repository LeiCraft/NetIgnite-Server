
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

    public sendMessage(message: string) {
        if (!this.isOnline()) {
            return false;
        }
        return this.socket.send(message);
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

