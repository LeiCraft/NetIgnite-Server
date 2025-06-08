import { AgentCMDRegistry } from "./registry";
import { Utils } from "../../utils";

export class AgentCommandUtils {
    static matchesConfig(config: AgentCMDRegistry.PayloadConfig, data: any): boolean {
        if (typeof data !== "object" || data === null) {
            return false;
        }

        for (const key in config) {
            const type = config[key];
            const value = data[key];

            if (type === "strArray") {
                if (!Array.isArray(value) || !value.every(v => typeof v === "string")) {
                    return false;
                }
            } else if (type === "numArray") {
                if (!Array.isArray(value) || !value.every(v => typeof v === "number")) {
                    return false;
                }
            } else if (typeof value !== type) {
                return false;
            }
        }

        return true;
    }
}


abstract class AgentBaseMessage<
    C extends AgentCMDRegistry.Commands,
    P extends Record<string, any>
> {
    constructor(
        readonly cmd: C,
        readonly id: number,
        readonly payload: P,
    ) { }

    abstract isValid(): boolean;

    public encode() {
        return `${this.cmd}:${this.id}:${JSON.stringify(this.payload)}`;
    }
}

export class AgentCommand<
    C extends AgentCMDRegistry.Commands,
    P extends AgentCMDRegistry.Payload<C>
> extends AgentBaseMessage<C, P> {

    constructor(cmd: C, id: number, payload: P,) {
        super(cmd, id, payload);
    }

    static create<
        C extends AgentCMDRegistry.Commands,
        P extends AgentCMDRegistry.Payload<C>
    >(cmd: C, payload: P): AgentCommand<C, P> {
        return new AgentCommand(cmd, Utils.getRandomU32(), payload);
    }

    public isValid() {
        const config = AgentCMDRegistry[this.cmd].cmd as AgentCMDRegistry.PayloadConfig;
        return AgentCommandUtils.matchesConfig(config, this.payload);
    }

    public static fromDecoded<
        C extends AgentCMDRegistry.Commands = any,
        P extends AgentCMDRegistry.Payload<C> = any
    >(data: string): AgentCommand<C, P>  | null {
        try {

            const [cmd, raw_id, payloadStr] = Utils.splitNTimes(data, ':', 2);

            if (!cmd || !raw_id || !payloadStr) {
                return null;
            }
            const id = parseInt(raw_id);
            const payload = JSON.parse(payloadStr) as P;

            if (typeof id !== "number" || isNaN(id) || id < 0 || id > 0xFFFFFFFF || typeof payload !== "object") {
                return null;
            }

            return new AgentCommand(cmd as C, id, payload as P);
            
        } catch {
            return null;
        }
    }


}

export class AgentResponse<
    C extends AgentCMDRegistry.Commands,
    P extends AgentCMDRegistry.Response<C>
> extends AgentBaseMessage<C, P> {

    constructor(cmd: C, id: number, payload: P,) {
        super(cmd, id, payload);
    }

    public isValid() {
        const config = AgentCMDRegistry[this.cmd].res as AgentCMDRegistry.PayloadConfig;
        return AgentCommandUtils.matchesConfig(config, this.payload);
    }

    public static fromDecoded<
        C extends AgentCMDRegistry.Commands = any,
        P extends AgentCMDRegistry.Response<C> = any
    >(hex: Buffer): AgentResponse<C, P>  | null {
        try {
            const dataStr = hex.toString('utf-8');
            const [cmd, raw_id, payloadStr] = Utils.splitNTimes(dataStr, ':', 2);

            if (!cmd || !raw_id || !payloadStr) {
                return null;
            }
            const id = parseInt(raw_id);
            const payload = JSON.parse(payloadStr) as P;

            if (typeof id !== "number" || isNaN(id) || id < 0 || id > 0xFFFFFFFF || typeof payload !== "object") {
                return null;
            }

            return new AgentResponse(cmd as C, id, payload as P);
            
        } catch {
            return null;
        }
    }

}
