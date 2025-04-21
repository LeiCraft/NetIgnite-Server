import type { Server as HTTPServer } from "http"
import { ControlService } from "../control-service";
import { ConfigHandler } from "../utils/config";

export default defineEventHandler(async (event) => {

    const server = (event.node.res.socket as any)?.server as HTTPServer | undefined;
    if (!server) {
        console.error("Control service server not found");
        return;
    }

    if (ControlService.isInitialized()) {
        return;
    }

    const config = await ConfigHandler.getConfig();
    if (!config) {
        console.error("Control service config could not be loaded");
        return;
    }

    await ControlService.init(server, config);
    console.log('Control service initialized');

});
