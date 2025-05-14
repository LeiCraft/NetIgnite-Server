import { describe, test, expect } from "bun:test";
import { AgentCommand, AgentResponse } from "~/server/agent-control-service/commands/message";

describe('message_encoding', () => {

    test('command encoding', () => {
        
        const command = new AgentCommand("WAKEUP", 123, {
            macAddress: "00:11:22:33:44:55",
            port: 8080,
        });

        const encoded = command.encodeToHex();
        const decoded = AgentCommand.fromDecodedHex(encoded);
        expect(decoded).not.toBeNull();
        expect((decoded as any).cmd).toBe("WAKEUP");
        expect((decoded as any).id).toBe(123);
        expect((decoded as any).payload).toEqual({
            macAddress: "00:11:22:33:44:55",
            port: 8080,
        });
    });

    test('response_encoding', () => {
        
        const response = new AgentResponse("WAKEUP", 123, {
            status: "success",
        });

        const encoded = response.encodeToHex();
        const decoded = AgentCommand.fromDecodedHex(encoded);
        expect(decoded).not.toBeNull();
        expect((decoded as any).cmd).toBe("WAKEUP");
        expect((decoded as any).id).toBe(123);
        expect((decoded as any).payload).toEqual({
            status: "success",
        });
    });

});
