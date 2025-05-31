import { DBStorage } from '@/server/db';
import type { UserAuthInfo } from '@/server/utils/auth/handler';

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    const result = await DBStorage.Agents.getAllByOwnerID(userinfo.userID);
    setResponseStatus(event, 201);
    
    return { status: "OK", data: result};
});