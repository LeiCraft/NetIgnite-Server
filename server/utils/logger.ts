
export class Logger {

    private static readonly logLevelMap = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        critical: 4,
    } as const;

    private static logLevel: typeof this.logLevelMap[Logger.LogLevel] = this.logLevelMap.info;
    
    static setLogLevel(level: Logger.LogLevel) {
        if (this.logLevelMap[level] === undefined) {
            throw new Error(`Invalid log level: ${level}`);
        }
        this.logLevel = this.logLevelMap[level];
    }

    static getLogLevel(): Logger.LogLevel {
        return Object.entries(this.logLevelMap).find(([_, value]) => value === this.logLevel) as any;
    }

    static debug(...args: any[]) {
        if (this.logLevel <= this.logLevelMap.debug) {
            console.debug(...args);
        }
    }

    static log(...args: any[]) {
        if (this.logLevel <= this.logLevelMap.info) {
            console.log(...args);
        }
    }

    static warn(...args: any[]) {
        if (this.logLevel <= this.logLevelMap.warn) {
            console.warn(...args);
        }
    }

    static error(...args: any[]) {
        if (this.logLevel <= this.logLevelMap.error) {
            console.error(...args);
        }
    }

    static critical(...args: any[]) {
        if (this.logLevel <= this.logLevelMap.critical) {
            console.error(...args);
        }
    }

}

export namespace Logger {
    export type LogLevel = "debug" | "info" | "warn" | "error" | "critical";
}