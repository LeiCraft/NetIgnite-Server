import { ControllableDevice } from "../agent-control-service/device";
import fs from "fs";

export interface ConfigLike {
	devices: ControllableDevice.IConfig[];
}

export class ConfigHandler {

	private static readonly configFilePath = process.env.CONFIG_FILE_PATH || './config/config.json';

	private static config: ConfigLike | null = null;

	static async getConfig(): Promise<ConfigLike | null> {
		await this.loadConfig();

		return this.config;
	}

	static async loadConfig() {

		// Check if the config is already loaded
		if (this.config) return;

		try {
			// Load the config from config file is not already loaded
			const configFile = fs.readFileSync(this.configFilePath, 'utf-8');
			this.config = JSON.parse(configFile) as ConfigLike;

		} catch (error) {
			console.error("Error loading config file:", error);
			process.exit(1);
		}
	}

}
