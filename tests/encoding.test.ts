import { describe, test, expect } from "bun:test";
import { AgentCommand, AgentResponse } from "@/server/agent-control-service/commands/message";

describe('message_encoding', () => {

    test('command encoding', () => {
        
        const command = new AgentCommand("WAKEUP", 123, {
            macAddress: "00:11:22:33:44:55",
            port: 8080,
        });

        const encoded = command.encode();
        const decoded = AgentCommand.fromDecoded(encoded);
        expect(decoded).not.toBeNull();

        if (!decoded) return;
        expect(decoded.cmd).toBe("WAKEUP");
        expect(decoded.id).toBe(123);
        expect(decoded.payload).toEqual({
            macAddress: "00:11:22:33:44:55",
            port: 8080,
        });
    });

    test('response_encoding', () => {
        
        const response = new AgentResponse("WAKEUP", 123, {
            status: "success",
            message: "Agent woken up successfully",
        });

        const encoded = response.encode();
        const decoded = AgentCommand.fromDecoded(encoded);
        expect(decoded).not.toBeNull();
        if (!decoded) return;
        expect(decoded.cmd).toBe("WAKEUP");
        expect(decoded.id).toBe(123);
        expect(decoded.payload).toEqual({
            status: "success",
            message: "Agent woken up successfully",
        });
    });

});
