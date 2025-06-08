import type { DBStorage } from "~/server/db";
import { ModelUtils } from "./utils";
import { useAPI } from "~/composables/useAPI";

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
            if (this.powering) {
                useNotificationToast({
                    message: "Device is already online or powering up.",
                    type: "info"
                });
                return;
            }
            this.powering = true;

            const response = await useAPI(`/api/devices/${this.id}/wakeup`, {
                method: 'POST'
            });

            this.powering = false;

            if (response.status !== "OK") {
                useNotificationToast({
                    message: `Failed to wake up device: ${response?.message || 'Unknown error'}`,
                    type: "error"
                });
                return;
            }

            useNotificationToast({
                message: `Device ${this.name} was successfully woken up.`,
                type: "success"
            });

        } catch (error: any) {
            useNotificationToast({
                message: `Error waking up device: ${error.message || 'Unknown error'}`,
                type: "error"
            });
        }
    }

    async shutdown() {
        // @TODO: Implement shutdown logic

        this.powering = false;
        this.status = 'offline';

        return "Shutdown functionality not implemented yet.";
    }

    async refreshStatus() {

        const statuses = await Device.Utils.getStatuses([this.id]); //@ts-ignore
        if (statuses && statuses[this.id.toString()]) { //@ts-ignore
            const status = statuses[this.id.toString()];

            if (status) {
                this.status = status;
                return
            }
        }
        this.status = "unknown";
        return

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

        static async updateStatuses(devices: Device.Data[]) {

            const statuses = await this.getStatuses(devices.map(device => device.id));
            if (!statuses) {
                for (const device of devices) {
                    device.status = "unknown";
                }
                return;
            }

            for (const device of devices) { //@ts-ignore
                const status = statuses[device.id.toString()];
                if (status) {
                    device.status = status;
                } else {
                    device.status = "unknown";
                }
            }

        }

        static async getStatuses(idList: number[]) {
            try {
                const response = await useAPI('/api/devices/status', {
                    method: 'GET',
                    params: {
                        ids: idList.join(',')
                    }
                });
                return response.data || null;
            } catch (error) {
                return null;
            }

        }

        static getAllDeviceTypes() {
            return DeviceUIUtils.getAllDeviceTypes();
        }

    }

}