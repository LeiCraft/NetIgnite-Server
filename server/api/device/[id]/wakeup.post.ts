import { ControlService } from "../../../control-service";

type WakeupPayload = {
    macAddress: string;
}

export default defineEventHandler(async (event) => {

    const payload = await readBody(event) as WakeupPayload;

    const deviceID = getRouterParam(event, "id") as string;
    const macAddress = payload?.macAddress;

    if (typeof macAddress !== "string") {
        setResponseStatus(event, 400);
        return { error: "Invalid payload" };
    }

    const device = ControlService.devices.get(deviceID);
    if (!device) {
        setResponseStatus(event, 404);
        return { error: "Device not found" };
    }

    const result = await device.sendWakeup(macAddress);
    if (!result) {
        setResponseStatus(event, 500);
        return { error: "Failed to send wakeup command" };
    }

    setResponseStatus(event, 200);
    return { success: true };
});
