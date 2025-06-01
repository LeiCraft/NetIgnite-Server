import { DBStorage } from '~/server/db';
import { UserAuthInfo } from '~/server/utils/auth/handler';

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    let result = await DBStorage.Devices.getAllByOwnerID(userinfo.userID);
    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to retrieve devices." , data: null };
    }

    const onlyFavorites = getQuery(event).onlyFavorites?.toString() === 'true';

    if (onlyFavorites) {
        const favorites = userinfo.favorites || [];
        result = result.filter(device => favorites.includes(device.id));
    }

    setResponseStatus(event, 200);
    return { status: "OK",  message: "Devices retrieved successfully.", data: result};
});