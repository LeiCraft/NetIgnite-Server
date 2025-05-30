
class DeviceUIUtils {

    private static readonly typeIcons = {
        router: 'bi bi-router text-primary',
        server: 'bi bi-hdd-network text-info',
        desktop: 'bi bi-pc-display text-warning',
        laptop: 'bi bi-laptop text-warning',
        printer: 'bi bi-printer text-success',
        nas: 'bi bi-hdd-stack text-info',
        switch: 'bi bi-diagram-3 text-primary'
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

    static getDeviceIcon(type: Device.Type): string {
        return this.typeIcons[type] || 'bi bi-device-hdd text-secondary';
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
        public powering: boolean = false
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
            data.powering || false
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
}

export namespace Device {

    export type Type = 'router' | 'server' | 'desktop' | 'laptop' | 'printer' | 'nas' | 'switch';
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
    }

}