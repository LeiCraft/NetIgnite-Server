import { ModelUtils } from "./utils";

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

}

export class Agent implements Agent.Data {

    constructor(
        public id: number,
        public name: string,
        public type: Agent.Type,
        public description: string,
        public secret: string,
        public status: ModelUtils.OnlineStatus.Type
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
        return ModelUtils.OnlineStatus.getStatusBadgeClass(this.status);
    }

    public getStatusIcon() {
        return ModelUtils.OnlineStatus.getStatusIcon(this.status);
    }

    async refreshStatus() {

        // @TODO: Implement status refresh logic

        return "Status refresh functionality not implemented yet.";

    }
}

export namespace Agent {

    export type Type = 'server' | 'microcontroller';

    export interface Data {
        id: number;
        name: string;
        type: Agent.Type;
        description: string;
        secret: string;
        status: ModelUtils.OnlineStatus.Type;
    }

    export class Utils {

        static getAllAgentTypes() {
            return AgentUIUtils.getAllAgentTypes();
        }

    }

}