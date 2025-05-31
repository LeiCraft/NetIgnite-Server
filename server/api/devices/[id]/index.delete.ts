import { DBStorage } from '@/server/db';
import { UserAuthInfo } from '@/server/utils/auth/handler';

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    const deviceID = parseInt(getRouterParam(event, "id") as string, 10);
    if (Number.isNaN(deviceID) && !Number.isSafeInteger(deviceID)) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid Device ID" };
    }

    const device = await DBStorage.Devices.getByID(deviceID);
    if (!device || device.ownerID !== userinfo.userID) {
        setResponseStatus(event, 404);
        return { status: "ERROR", message: "Device not found or inaccessible by user" };
    }

    const result = await DBStorage.Devices.deleteByID(deviceID);

    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to delete Device" };
    }

    setResponseStatus(event, 200);
    return { status: "OK", message: "Device deleted successfully" };
});
