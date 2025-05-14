import { ControlService } from "../../../agent-control-service";

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

    const device = ControlService.devices.get(deviceID);
    if (!device) {
        setResponseStatus(event, 404);
        return { message: "Device not found" };
    }

    let result = false;
    try {
        result = await device.sendWakeup(macAddress);
    } catch (error) {
        console.error("Error sending wakeup command:", error);
        setResponseStatus(event, 500);
        return { message: "Failed to send wakeup command" };
    }

    setResponseStatus(event, 200);
    return { success: true, message: "Wakeup command sent" };
});
