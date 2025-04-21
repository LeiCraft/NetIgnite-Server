import { WebSocketServer } from "ws"
import type { Server as HTTPServer, IncomingMessage as HTTPRequest } from "http"
import type { DevicesDB } from "./device";

class ControlServiceServerUtils {

    private static getBasicAuthCredentials(req: HTTPRequest) {

        const authHeader = req.headers['authorization'];
        if (!authHeader) return null;

        const [scheme, base64Credentials] = authHeader.split(' ');
        if (scheme !== 'Basic') return null;
        const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf8');

        const credentialsArr = decodedCredentials.split(':');
        if (credentialsArr.length !== 2) return null;

        return {
            id: credentialsArr[0] || "",
            secret: credentialsArr[1] || ""
        };
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

export class ControlServiceServer {

    private readonly server: WebSocketServer;

    constructor(
        httpServer: HTTPServer,
        private readonly devices: DevicesDB
    ) {
        this.server = new WebSocketServer({ server: httpServer })

        this.server.on("connection", (ws, req) => {

            const device = ControlServiceServerUtils.getDeviceFromRequest(req, this.devices);
            if (!device) {
                ws.close(1008, "Missing or invalid credentials");
                return;
            }

            console.log(`Device connected: ${device.id}`);

            ws.on("message", (message) => {
                console.log(`Received message: ${message}`)
                // currently, client does not send messages
            });

            ws.on("error", (error) => {
                console.error(`WebSocket error: ${error}`);
            });

            ws.on("close", () => {
                device.socket = null;
                console.log("Client disconnected");
            });
        });
    }
}