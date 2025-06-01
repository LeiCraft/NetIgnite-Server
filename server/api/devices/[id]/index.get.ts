import { UserAuthInfo } from "@/server/utils/auth/handler";
import { DBStorage } from "@/server/db";

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    const deviceID = parseInt(getRouterParam(event, "id") as string, 10);
    if (Number.isNaN(deviceID) && !Number.isSafeInteger(deviceID)) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid Device ID", data: null };
    }

    const device = await DBStorage.Devices.getByIDAndOwnerID(deviceID, userinfo.userID);
    if (!device || device.ownerID !== userinfo.userID) {
        setResponseStatus(event, 404);
        return { status: "ERROR", message: "Device not found or inaccessible by user", data: null };
    }

    setResponseStatus(event, 200);
    return { status: "OK", message: "Device retrieved successfully", data: device };
});
