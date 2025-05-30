
class DeviceTypeData {
    constructor(
        readonly label: string,
        readonly icon: string
    ) {}
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

    private static readonly statusClasses = {
        online: 'bg-success',
        standby: 'bg-warning',
        offline: 'bg-danger'
    } as const;

    private static readonly statusIcons = {
        online: 'bi bi-check-circle-fill',
        standby: 'bi bi-pause-circle-fill',
        offline: 'bi bi-x-circle-fill'
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

    static getStatusBadgeClass(status: Device.Status): string {
        return this.statusClasses[status] || 'bg-secondary';
    }

    static getStatusIcon(status: Device.Status): string {
        return this.statusIcons[status] || 'bi bi-question-circle-fill';
    }

}

export class Device implements Device.Data {

    constructor(
        public id: number,
        public name: string,
        public type: Device.Type,
        public description: string,
        public ipAddress: string,
        public macAddress: string,
        public status: Device.Status,
        public powering: boolean = false,
        public isFavorite: boolean = false
    ) {}

    static fromData(data: Device.Data) {
        return new Device(
            data.id,
            data.name,
            data.type,
            data.description,
            data.ipAddress,
            data.macAddress,
            data.status,
            data.powering || false,
            data.isFavorite || false
        );
    }

    public getDeviceIcon() {
        return DeviceUIUtils.getDeviceIcon(this.type);
    }

    public getStatusBadgeClass() {
        return DeviceUIUtils.getStatusBadgeClass(this.status);
    }

    public getStatusIcon() {
        return DeviceUIUtils.getStatusIcon(this.status);
    }

    public getFavoriteIcon() {
        return this.isFavorite ? "bi bi-star-fill" : "bi bi-star";
    }
}

export namespace Device {

    export type Type = 'server' | 'desktop' | 'laptop' | 'printer' | 'nas';
    export type Status = 'online' | 'standby' | 'offline';

    export interface Data {
        id: number;
        name: string;
        type: Device.Type;
        description: string;
        ipAddress: string;
        macAddress: string;
        status: Device.Status;
        powering?: boolean;
        isFavorite?: boolean;
    }

    export class Utils {

        static getAllDeviceTypes() {
            return DeviceUIUtils.getAllDeviceTypes();
        }

    }

}