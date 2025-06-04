import { DBStorage } from "@/server/db";
import type { APIUserInfo } from "~/server/utils/auth/handler";

type UpdatePayload = Omit<DBStorage.User.ModelWithoutID, "role" | "password_hash"> & {
    password?: string;
    role?: DBStorage.User.Model.Role | undefined;
};

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as APIUserInfo;
    if (!userinfo) return;

    let userID = userinfo.userID;
    let userRole = undefined;

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


    if (userinfo.adminMode) {
        userID = parseInt(getRouterParam(event, "id") as string, 10);
        if (Number.isNaN(userID) && !Number.isSafeInteger(userID)) {
            setResponseStatus(event, 400);
            return { status: "ERROR", message: "Invalid user ID" };
        }
    }

    if (userinfo.adminMode === "superadmin" && userinfo.userID !== userID) {
        if (!["user", "admin"].includes(payload.role as string)) {
            setResponseStatus(event, 400);
            return { status: "ERROR", message: "Invalid role" };
        }
        userRole = payload.role;
    }

    // Check if username is already taken
    if (await DBStorage.Users.isUsernameTaken(payload.username, userID)) {
        setResponseStatus(event, 409);
        return { status: "ERROR", message: "Username is already taken" };
    }

    const updatePayload = {
        id: userID,
        role: userRole,
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