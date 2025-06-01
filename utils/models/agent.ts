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

    public id: number;
    public name: string;
    public type: Agent.Type;
    public description: string;
    public secret: string;
    public ownerID: number;
    public status: ModelUtils.OnlineStatus.Type

    constructor(data: Agent.Data) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.description = data.description;
        this.secret = data.secret;
        this.ownerID = data.ownerID;
        this.status = data.status;
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

        const statuses = await Agent.Utils.getAgentsStatuses([this.id]);
        if (statuses && statuses[this.id.toString()]) {
            const status = statuses[this.id.toString()];

            if (status) {
                this.status = status;
                return
            }
        }
        this.status = "unknown";
        return
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
        ownerID: number;
        status: ModelUtils.OnlineStatus.Type;
    }

    export class Utils {

        static async updateAgentsStatuses(agents: Agent.Data[]) {

            const statuses = await this.getAgentsStatuses(agents.map(agent => agent.id));
            if (!statuses) {
                for (const agent of agents) {
                    agent.status = "unknown";
                }
                return;
            }

            for (const agent of agents) {
                const status = statuses[agent.id.toString()];
                if (status) {
                    agent.status = status;
                } else {
                    agent.status = "unknown";
                }
            }

        }

        static async getAgentsStatuses(idList: number[]) {
            try {
                const response = await $fetch('/api/agents/status', {
                    method: 'GET',
                    params: {
                        ids: idList.join(',')
                    }
                });
                return response?.data || null;
            } catch (error) {
                return null;
            }

        }

        static getAllAgentTypes() {
            return AgentUIUtils.getAllAgentTypes();
        }

    }

}