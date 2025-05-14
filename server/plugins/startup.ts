import { ControlService } from "../agent-control-service";
import { ConfigHandler } from "../utils/config";

export default defineNitroPlugin(async (nitroApp) => {

	await ConfigHandler.loadConfig();
	console.log('Config loaded');


    if (ControlService.isInitialized()) return;

    const config = await ConfigHandler.getConfig();
    if (!config) {
        console.error("Control service config could not be loaded");
        return;
    }

    await ControlService.init(config);
    console.log('Control service initialized');

});

