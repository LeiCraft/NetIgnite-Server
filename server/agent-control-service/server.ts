import type { IncomingMessage as HTTPRequest } from "http"
import type { ControllableDevice, DevicesDB } from "./device";
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
        async open(peer) {

            const device = ControlServiceServerUtils.getDeviceFromRequest(peer.request as any, devices);
            if (!device) {
                peer.close(1008, "Missing or invalid credentials");
                return;
            }

            if (device.isOnline()) {
                await device.closeConnection();
            }

            device.peerID = peer.id;
            device.socket = peer.websocket as WebSocket;
            clients.set(peer.id, device);
        },

        message(peer, message) {
            const device = clients.get(peer.id);
            if (device?.onMessage) {
                device.onMessage(message.uint8Array());
            }
        },

        error(peer, error) {
            console.error(`WebSocket error: ${error}`);
        },

        close(peer) {
            const device = clients.get(peer.id);
            if (device) {
                device.peerID = null;
                device.socket = null;
                clients.delete(peer.id);
                console.log(`Client disconnected: ${device.id}`);
            }
        }
    }
}


export class ControlServiceServer {

    private readonly handler: Partial<WSHooks>;

    readonly clients: Map<string, ControllableDevice> = new Map();

    constructor(
        private readonly devices: DevicesDB
    ) {
        this.handler = ControlServiceServerHandlerFactory(this.clients, this.devices);
    }

    public getWebSocketHandler() {
        return this.handler;
    }
}