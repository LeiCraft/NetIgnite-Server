import { AgentControlService } from "../agent-control-service";
import { ConfigHandler } from "../utils/config";
import { DBStorage } from "../utils/db";
import { SessionHandler } from "../utils/sessions";

export default defineNitroPlugin(async () => {

	await ConfigHandler.loadConfig();
	console.log('Config loaded');


    if (AgentControlService.isInitialized()) return;

    const config = await ConfigHandler.getConfig();
    if (!config) {
        console.error("Error getting config");
        process.exit(1);
    }

    await DBStorage.init();
    console.log('DB initialized');

    await SessionHandler.init();
    console.log('Session handler initialized');

    const agents = await DBStorage.getAllAgents();

    await AgentControlService.init({ ...config, agents });
    console.log('Control service initialized');

});

