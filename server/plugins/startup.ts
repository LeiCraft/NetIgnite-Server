import { ConfigHandler } from "../utils/config";

export default defineNitroPlugin(async (nitroApp) => {

	await ConfigHandler.loadConfig();
	console.log('Config loaded');

});
