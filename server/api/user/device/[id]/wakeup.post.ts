import { AgentControlService } from "../../../../agent-control-service";

type WakeupPayload = {
    macAddress: string;
}

export default defineEventHandler(async (event) => {

    const payload = await readBody(event) as WakeupPayload;

    const agentID = parseInt(getRouterParam(event, "id") as string, 10);
    if (Number.isNaN(agentID) && !Number.isSafeInteger(agentID)) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid Agent ID" };
    }
    const macAddress = payload?.macAddress;

    if (typeof macAddress !== "string") {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid MAC-Address" };
    }

    const device = AgentControlService.agents.get(agentID);
    if (!device) {
        setResponseStatus(event, 404);
        return { status: "ERROR", message: "Device not found" };
    }

    let result = null;
    try {
        result = await device.sendCommand("WAKEUP", {
            macAddress: macAddress,
            port: 9
        });
    } catch {}

    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: `Failed to send wakeup command` };
    }

    if (result?.status !== "OK") {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Wakeup command failed: " + result?.message };
    }

    setResponseStatus(event, 200);
    return { status: "OK", message: "Wakeup command sent" };
});
