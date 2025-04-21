import type { Server as HTTPServer } from "http"
import { ControllableDevice, DevicesDB } from "./device"
import { ControlServiceServer } from "./server";

export class ControlService {

    private static initialized = false;

    static readonly devices: DevicesDB = new Map<string, ControllableDevice>();

    private static server: ControlServiceServer;
    
    static async init(httpServer: HTTPServer, config: ControlService.IConfig) {
        if (this.initialized) return;
        this.initialized = true;

        for (const deviceConfig of config.devices) {
            const device = ControllableDevice.fromConfig(deviceConfig);
            this.devices.set(device.id, device);
        }

        this.server = new ControlServiceServer(httpServer, this.devices);

        console.log("Control service initialized");
    }

    static isInitialized() {
        return this.initialized;
    }

}

export namespace ControlService {

    export interface IConfig {
        devices: ControllableDevice.IConfig[];
    }

}