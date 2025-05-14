import type { Server as HTTPServer, IncomingMessage as HTTPRequest } from "http"
import type { ControllableDevice, DevicesDB } from "./device";
import type { Peer, Hooks as WSHooks } from "crossws"

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

    static getDeviceFromRequest(req: HTTPRequest, devices: DevicesDB) {

        const credentials = this.getBasicAuthCredentials(req);
        if (!credentials) return null;

        const device = devices.get(credentials.id);
        if (!device) return null;

        if (device.secret !== credentials.secret) return null;

        return device;

    }

}

function ControlServiceServerHandlerFactory(clients: Map<string, ControllableDevice>, devices: DevicesDB): Partial<WSHooks> {
    return {
        open(peer) {
            const device = ControlServiceServerUtils.getDeviceFromRequest(peer.request as any, devices);
            if (!device) {
                peer.close(1008, "Missing or invalid credentials");
                return;
            }
            device.socket = peer.websocket as WebSocket;
            clients.set(peer.id, device);
        },

        message(peer, message) {
            console.log(`Received message: ${message}`)
            // currently, client does not send messages
        },

        error(peer, error) {
            console.error(`WebSocket error: ${error}`);
        },

        close(peer) {
            const device = clients.get(peer.id);
            if (device) {
                device.socket = null;
                clients.delete(peer.id);
                console.log(`Client disconnected: ${device.id}`);
            }
        }
    }
}


export class ControlServiceServer {

    //private readonly server: WebSocketServer;
    private readonly handler: Partial<WSHooks>;

    private readonly clients: Map<string, ControllableDevice> = new Map();

    constructor(
        //httpServer: HTTPServer,
        private readonly devices: DevicesDB
    ) {
        //this.server = new WebSocketServer({ server: httpServer })

        // this.server.on("connection", (ws, req) => {

        //     const device = ControlServiceServerUtils.getDeviceFromRequest(req, this.devices);
        //     if (!device) {
        //         ws.close(1008, "Missing or invalid credentials");
        //         return;
        //     }

        //     console.log(`Device connected: ${device.id}`);

        //     ws.on("message", (message) => {
        //         console.log(`Received message: ${message}`)
        //         // currently, client does not send messages
        //     });

        //     ws.on("error", (error) => {
        //         console.error(`WebSocket error: ${error}`);
        //     });

        //     ws.on("close", () => {
        //         device.socket = null;
        //         console.log("Client disconnected");
        //     });
        // });
        this.handler = ControlServiceServerHandlerFactory(this.clients, this.devices);
    }

    public getWebSocketHandler() {
        return this.handler;
    }
}