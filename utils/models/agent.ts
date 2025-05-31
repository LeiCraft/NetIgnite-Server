
class AgentTypeData {
    constructor(
        readonly label: string,
        readonly icon: string
    ) {}
}

interface AgentTypeFullData extends AgentTypeData {
    readonly name: Agent.Type;
}

class AgentUIUtils {

    private static readonly typeList = {
        server: new AgentTypeData('Server', 'bi bi-hdd-network text-info'),
        microcontroller: new AgentTypeData('Microcontroller', 'bi bi-cpu text-primary')
    } as const;

    private static readonly statusClasses = {
        online: 'bg-success',
        offline: 'bg-danger'
    } as const;

    private static readonly statusIcons = {
        online: 'bi bi-check-circle-fill',
        offline: 'bi bi-x-circle-fill'
    } as const;


    static getAgentTypeLabel(type: Agent.Type): string {
        const data = this.typeList[type]
        if (data && data.label) {
            return data.label;
        }
        return 'Unknown Agent Type';
    }

    static getAllAgentTypes(): AgentTypeFullData[] {
        return Object.entries(this.typeList).map(([name, data]) => ({
            name: name as Agent.Type,
            ...data
        }));
    }


    static getAgentIcon(type: Agent.Type) {
        const data = this.typeList[type]
        if (data && data.icon) {
            return data.icon;
        }
        return 'bi bi-Agent-hdd text-secondary';
    }

    static getStatusBadgeClass(status: Agent.Status): string {
        return this.statusClasses[status] || 'bg-secondary';
    }

    static getStatusIcon(status: Agent.Status): string {
        return this.statusIcons[status] || 'bi bi-question-circle-fill';
    }

}

export class Agent implements Agent.Data {

    constructor(
        public id: number,
        public name: string,
        public type: Agent.Type,
        public description: string,
        public secret: string,
        public status: Agent.Status
    ) {}

    static fromData(data: Agent.Data) {
        return new Agent(
            data.id,
            data.name,
            data.type,
            data.description,
            data.secret,
            data.status
        );
    }

    public getAgentIcon() {
        return AgentUIUtils.getAgentIcon(this.type);
    }

    public getStatusBadgeClass() {
        return AgentUIUtils.getStatusBadgeClass(this.status);
    }

    public getStatusIcon() {
        return AgentUIUtils.getStatusIcon(this.status);
    }

    async refreshStatus() {

        // @TODO: Implement status refresh logic

        return "Status refresh functionality not implemented yet.";

    }
}

export namespace Agent {

    export type Type = 'server' | 'microcontroller';
    export type Status = 'online' | 'offline';

    export interface Data {
        id: number;
        name: string;
        type: Agent.Type;
        description: string;
        secret: string;
        status: Agent.Status;
    }

    export class Utils {

        static getAllAgentTypes() {
            return AgentUIUtils.getAllAgentTypes();
        }

    }

}