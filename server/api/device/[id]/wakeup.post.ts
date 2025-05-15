import { AgentControlService } from "../../../agent-control-service";

type WakeupPayload = {
    macAddress: string;
}

export default defineEventHandler(async (event) => {

    const payload = await readBody(event) as WakeupPayload;

    const deviceID = getRouterParam(event, "id") as string;
    const macAddress = payload?.macAddress;

    if (typeof macAddress !== "string") {
        setResponseStatus(event, 400);
        return { message: "Invalid payload" };
    }

    const device = AgentControlService.agents.get(deviceID);
    if (!device) {
        setResponseStatus(event, 404);
        return { message: "Device not found" };
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
        return { message: `Failed to send wakeup command` };
    }

    if (result?.status !== "OK") {
        setResponseStatus(event, 500);
        return { message: "Wakeup command failed: " + result?.message };
    }

    setResponseStatus(event, 200);
    return { success: true, message: "Wakeup command sent" };
});
