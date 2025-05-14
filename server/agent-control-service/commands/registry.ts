type TypesMapping = {
    string: string;
    number: number;
    boolean: boolean;
    object: { [key: string]: any };
    array: any[];
};

type ResolveType<T> = T extends keyof TypesMapping ? TypesMapping[T] : never;

type ResolveSchema<T> = {
    readonly [K in keyof T]: ResolveType<T[K]>;
};

function createRegistry<const T extends Record<string, Record<string, keyof TypesMapping>>>(config: T) {
    return config as unknown as {
        readonly [K in keyof T]: ResolveSchema<T[K]>;
    };
}

const AgentCMDRegistry = createRegistry({
    WAKEUP: {
        macAddress: "string",
    },
});
export namespace AgentCMDRegistry {



    export type Commands = keyof typeof AgentCMDRegistry;
    export type Payload<
        C extends keyof typeof AgentCMDRegistry,
        Config extends Record<string, keyof TypesMapping> = (typeof AgentCMDRegistry)[C]
    > = {
            [K in keyof Config]: TypesMapping[Config[K]];
    };


}

