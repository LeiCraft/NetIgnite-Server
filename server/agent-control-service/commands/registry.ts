type TypesMapping = {
    string: string;
    number: number;
    boolean: boolean;
    object: Record<string, any>;
    strArray: string[];
    numArray: number[];
};

type ResolveType<T> = T extends keyof TypesMapping ? TypesMapping[T] : never;

type ResolveSchema<T> = {
    readonly [K in keyof T]: ResolveType<T[K]>;
};

interface CommandConfig {
    cmd: AgentCMDRegistry.PayloadConfig;
    res: AgentCMDRegistry.PayloadConfig;
};

function createRegistry<const T extends Record<string, CommandConfig>>(config: T) {
    return config as unknown as {
        readonly [K in keyof T]: {
            readonly cmd: ResolveSchema<T[K]["cmd"]>;
            readonly res: ResolveSchema<T[K]["res"]>;
        }
    };
}


export namespace AgentCMDRegistry {

    export type PayloadConfig = Record<string, keyof TypesMapping>;

    export type Commands = keyof typeof AgentCMDRegistry;
    export type Payload<C extends Commands, Config = (typeof AgentCMDRegistry)[C]["cmd"]> = {
        [K in keyof Config]: Config[K];
    }
    export type Response<C extends Commands, Config = (typeof AgentCMDRegistry)[C]["res"]> = {
        [K in keyof Config]: Config[K];
    }

}


export const AgentCMDRegistry = createRegistry({
    "WAKEUP": {
        cmd: {
            macAddress: "string",
            port: "number",
        },
        res: {
            status: "string", // "OK" or "ERROR"
            message: "string",
        }
    },
    "HEARTBEAT": {
        cmd: {},
        res: {}
    },
    "GET_STATUS": {
        cmd: {
            ipAddress: "string",
        },
        res: {
            status: "string", // "OK" or "ERROR"
            message: "string"
        }
    }
});
