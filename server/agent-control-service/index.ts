import type { Server as HTTPServer } from "http"
import { ControllableDevice, DevicesDB } from "./device"
import { ControlServiceServer } from "./server";

export class ControlService {

    private static initialized = false;

    static readonly devices: DevicesDB = new Map<string, ControllableDevice>();

    private static server: ControlServiceServer;
    
    static async init(config: ControlService.IConfig) {
        if (this.initialized) return;
        this.initialized = true;

        for (const deviceConfig of config.devices) {
            const device = ControllableDevice.fromConfig(deviceConfig);
            this.devices.set(device.id, device);
        }

        this.server = new ControlServiceServer(this.devices);
    }

    static isInitialized() {
        return this.initialized;
    }

    static async getSocketHandler() {
        if (!this.initialized) {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            if (this.initialized) {
                return this.server.getWebSocketHandler();
            }
            throw new Error("Control service not initialized");
        }

        return this.server.getWebSocketHandler();
    }

    static async getClients() {
        if (!this.initialized) {
            await new Promise((resolve) => {
                setTimeout(resolve, 1000);
            });
            if (this.initialized) {
                return this.server.clients;
            }
            throw new Error("Control service not initialized");
        }

        return this.server.clients;
    }

}

export namespace ControlService {

    export interface IConfig {
        devices: ControllableDevice.IConfig[];
    }

}