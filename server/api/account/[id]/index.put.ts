import { DBStorage } from "@/server/db";

type UpdatePayload = Omit<DBStorage.User.ModelWithoutID, "role" | "password_hash"> & {
    password?: string;
};

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    let userID = userinfo.userID;

    const payload = await readBody(event) as UpdatePayload | undefined;
    if (
        !payload ||
        typeof payload.username !== "string" ||
        // @TODO Better validation for favorites so only num arrays are allowed
        !Array.isArray(payload.favorites)
    ) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid payload" };
    }


    if (userinfo.role === "admin") {
        userID = parseInt(getRouterParam(event, "id") as string, 10);
        if (Number.isNaN(userID) && !Number.isSafeInteger(userID)) {
            setResponseStatus(event, 400);
            return { status: "ERROR", message: "Invalid user ID" };
        }
    }

    // Check if username is already taken
    if (await DBStorage.Users.isUsernameTaken(payload.username, userID)) {
        setResponseStatus(event, 409);
        return { status: "ERROR", message: "Username is already taken" };
    }

    const updatePayload = {
        id: userID,
        username: payload.username,
        favorites: payload.favorites,
        password: payload.password
    }

    const result = await DBStorage.Users.update(updatePayload);
    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to update User Account" };
    }

    const session = SessionHandler.getActiveSessionAndRefresh(getCookie(event, 'session') || "");
    if (session) {
        session.username = payload.username;
        session.favorites = payload.favorites;
    }

    setResponseStatus(event, 201);
    return { status: "OK", message: "User Account updated successfully" };
});