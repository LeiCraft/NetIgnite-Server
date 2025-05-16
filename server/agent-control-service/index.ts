import { ControllableAgent, AgentsDB } from "./agent"
import { ControlServiceServer } from "./server";

export class AgentControlService {

    private static initialized = false;

    static readonly agents: AgentsDB = new Map<string, ControllableAgent>();

    private static server: ControlServiceServer;
    
    static async init(config: AgentControlService.IConfig) {
        if (this.initialized) return;
        this.initialized = true;

        for (const agentConfig of config.agents) {
            const agent = ControllableAgent.fromConfig(agentConfig);
            this.agents.set(agent.id, agent);
        }

        this.server = new ControlServiceServer(this.agents);
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

export namespace AgentControlService {

    export interface IConfig {
        agents: ControllableAgent.IConfig[];
    }

}