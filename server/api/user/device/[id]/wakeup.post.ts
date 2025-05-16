import { AgentControlService } from "../../../../agent-control-service";

type WakeupPayload = {
    macAddress: string;
}

export default defineEventHandler(async (event) => {

    const payload = await readBody(event) as WakeupPayload;

    const deviceID = getRouterParam(event, "id") as string;
    const macAddress = payload?.macAddress;

    if (typeof macAddress !== "string") {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid payload" };
    }

    const device = AgentControlService.agents.get(deviceID);
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
