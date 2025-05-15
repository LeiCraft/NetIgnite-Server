import type { IncomingMessage as HTTPRequest } from "http"
import type { ControllableAgent, AgentsDB } from "./agent";
import type { Hooks as WSHooks } from "crossws"

class ControlServiceServerUtils {

    private static getBasicAuthCredentials(req: HTTPRequest) {
        try {
            const url = new URL(req.url as string, `http://${req.headers.host}`); // `http://` base is required for relative URL
            const encodedId = url.searchParams.get('id');
            const encodedSecret = url.searchParams.get('secret');

            if (!encodedId || !encodedSecret) return null;

            const id = Buffer.from(encodedId, 'hex').toString('utf8');
            const secret = Buffer.from(encodedSecret, 'hex').toString('utf8');

            return { id, secret };
        } catch {
            return null;
        }
    }

    static getAgent(req: HTTPRequest, agents: AgentsDB) {

        const credentials = this.getBasicAuthCredentials(req);
        if (!credentials) return null;

        const agent = agents.get(credentials.id);
        if (!agent) return null;

        if (agent.secret !== credentials.secret) return null;

        return agent;

    }

}

function ControlServiceServerHandlerFactory(clients: Map<string, ControllableAgent>, agents: AgentsDB): Partial<WSHooks> {
    return {
        async open(peer) {

            const agent = ControlServiceServerUtils.getAgent(peer.request as any, agents);
            if (!agent) {
                peer.close(1008, "Missing or invalid credentials");
                return;
            }

            if (agent.isOnline()) {
                await agent.closeConnection();
            }

            agent.peerID = peer.id;
            agent.socket = peer.websocket as WebSocket;
            clients.set(peer.id, agent);
            console.log(`Agent connected: ${agent.id}`);
        },

        message(peer, message) {
            const agent = clients.get(peer.id);
            if (agent?.onMessage) {
                agent.onMessage(message.text());
            }
        },

        error(peer, error) {
            console.error(`WebSocket error: ${error}`);
        },

        close(peer) {
            const agent = clients.get(peer.id);
            if (agent) {
                agent.peerID = null;
                agent.socket = null;
                clients.delete(peer.id);
                console.log(`Agent disconnected: ${agent.id}`);
            }
        }
    }
}


export class ControlServiceServer {

    private readonly handler: Partial<WSHooks>;

    readonly clients: Map<string, ControllableAgent> = new Map();

    constructor(
        private readonly agents: AgentsDB
    ) {
        this.handler = ControlServiceServerHandlerFactory(this.clients, this.agents);
    }

    public getWebSocketHandler() {
        return this.handler;
    }
}