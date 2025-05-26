import { AgentControlService } from "../agent-control-service";
import { ConfigHandler } from "../utils/config";
import { DBStorage } from "../utils/db";
import { Logger } from "../utils/logger";
import { SessionHandler } from "../utils/auth/sessions";

export default defineNitroPlugin(async () => {

	const config = await ConfigHandler.loadConfig();
    if (!config) {
        Logger.error("Error getting config");
        process.exit(1);
    }
	Logger.log('Config loaded');

    if (config.logLevel) {
        Logger.setLogLevel(config.logLevel);
    }

    if (AgentControlService.isInitialized()) return;

    await DBStorage.init();
    console.log('DB initialized');

    await SessionHandler.init();
    console.log('Session handler initialized');

    const agents = await DBStorage.getAllAgents();

    await AgentControlService.init({ ...config, agents });
    console.log('Control service initialized');

});

