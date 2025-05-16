import { AgentControlService } from "../agent-control-service";
import { ConfigHandler } from "../utils/config";

export default defineNitroPlugin(async (nitroApp) => {

	await ConfigHandler.loadConfig();
	console.log('Config loaded');


    if (AgentControlService.isInitialized()) return;

    const config = await ConfigHandler.getConfig();
    if (!config) {
        console.error("Error getting config");
        process.exit(1);
    }

    await AgentControlService.init(config);
    console.log('Control service initialized');

});

