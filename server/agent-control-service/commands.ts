import { AgentCMDRegistry } from "./commands/registry";



abstract class AgentBaseMessage<T extends AgentCMDRegistry.Commands, P extends AgentCommand.IPayload> {

    constructor(
        readonly cmd: T,
        readonly id: number,
        readonly payload: P,
    ) {}

}

export class AgentCommand<T extends AgentCMDRegistry.Commands, P extends AgentCommand.IPayload> extends AgentBaseMessage<T, P> {

    constructor(cmd: T, id: number, payload: P,) {
        super(cmd, id, payload);
    }

    static create<T extends AgentCMDRegistry.Commands, P extends AgentCMDRegistry[T]>(cmd: T, payload: P): AgentCommand<T, P> {

    }

    toJSON() {
        return {
            cmd: this.cmd,
            id: this.id,
            payload: this.payload,
        };

}

new AgentCommand("", 1, {

export namespace AgentCommand {
    export interface IPayload {
        [key: string]: any;
    }
}
