import type { DBStorage } from "~/server/db";
import { ModelUtils } from "./utils";

class DeviceTypeData {
    constructor(
        readonly label: string,
        readonly icon: string
    ) { }
}

interface DeviceTypeFullData extends DeviceTypeData {
    readonly name: Device.Type;
}

class DeviceUIUtils {

    private static readonly typeList = {
        server: new DeviceTypeData('Server', 'bi bi-hdd-network text-info'),
        desktop: new DeviceTypeData('Desktop PC', 'bi bi-pc-display text-primary'),
        laptop: new DeviceTypeData('Laptop', 'bi bi-laptop text-primary'),
        printer: new DeviceTypeData('Printer', 'bi bi-printer text-success'),
        nas: new DeviceTypeData('NAS Storage', 'bi bi-hdd-stack text-info')
    } as const;

    static getDeviceTypeLabel(type: Device.Type): string {
        const data = this.typeList[type]
        if (data && data.label) {
            return data.label;
        }
        return 'Unknown Device Type';
    }

    static getAllDeviceTypes(): DeviceTypeFullData[] {
        return Object.entries(this.typeList).map(([name, data]) => ({
            name: name as Device.Type,
            ...data
        }));
    }


    static getDeviceIcon(type: Device.Type) {
        const data = this.typeList[type]
        if (data && data.icon) {
            return data.icon;
        }
        return 'bi bi-device-hdd text-secondary';
    }

}

export class Device implements Device.Data {

    public id: number;
    public name: string;
    public type: Device.Type;
    public description: string;
    public macAddress: string;
    public port: number;
    public agentID: number;
    public ownerID: number;
    public status: ModelUtils.OnlineStatus.Type;
    public powering: boolean = false;
    public isFavorite: boolean = false;

    constructor(data: Device.Data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.description = data.description;
        this.macAddress = data.macAddress;
        this.port = data.port;
        this.agentID = data.agentID;
        this.ownerID = data.ownerID;
        this.status = data.status;
        this.powering = data.powering || false;
        this.isFavorite = data.isFavorite || false;
    }

    public getDeviceIcon() {
        return DeviceUIUtils.getDeviceIcon(this.type);
    }

    public getStatusBadgeClass() {
        return ModelUtils.OnlineStatus.getStatusBadgeClass(this.status);
    }

    public getStatusIcon() {
        return ModelUtils.OnlineStatus.getStatusIcon(this.status);
    }

    public getFavoriteIcon() {
        return this.isFavorite ? "bi bi-star-fill" : "bi bi-star";
    }


    async wakeUP() {
        try {
            if (this.status === 'online' || this.powering) {
                return "Already online or powering up";
            }
            this.powering = true;

            const response = await $fetch(`/api/devices/${this.id}/wakeup`, {
                method: 'POST'
            });

            this.powering = false;

            if (!response || response.status !== "OK") {
                return `Failed to wake up device: ${response?.message || 'Unknown error'}`;
            }

            this.status = 'online';
            return "OK";

        } catch (error) {
            this.powering = false;
            console.error("Error waking up device:", error);
            return "Error waking up device";
        }
    }

    async shutdown() {
        // @TODO: Implement shutdown logic

        this.powering = false;
        this.status = 'offline';

        return "Shutdown functionality not implemented yet.";
    }

    async refreshStatus() {

        // @TODO: Implement status refresh logic

        return "Status refresh functionality not implemented yet.";

    }

    public toggleFavorite() {
        this.isFavorite = !this.isFavorite;
    }

}

export namespace Device {

    export type Type = 'server' | 'desktop' | 'laptop' | 'printer' | 'nas';

    export interface Data extends DBStorage.Device.Model {
        status: ModelUtils.OnlineStatus.Type;
        powering?: boolean;
        isFavorite?: boolean;
    }

    export class Utils {

        static getAllDeviceTypes() {
            return DeviceUIUtils.getAllDeviceTypes();
        }

    }

}