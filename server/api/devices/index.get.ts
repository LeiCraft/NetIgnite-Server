import { DBStorage } from '@/server/utils/db';
import { UserAuthInfo } from '~/server/utils/auth/handler';

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    const result = await DBStorage.getAllDevicesByOwnerID(userinfo.userID);
    setResponseStatus(event, 201);
    
    return { status: "OK", data: result};
});