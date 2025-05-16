import { getCookie } from "h3";

export default defineEventHandler(async (event) => {

    const sessionID = getCookie(event, 'session');
    if (!sessionID) {
        setResponseStatus(event, 401);
        return { status: "ERROR", message: "No session found" };
    }

    const session = SessionHandler.getActiveSessionAndRefresh(sessionID);
    if (!session) {
        setResponseStatus(event, 401);
        return { status: "ERROR", message: "Invalid session" };
    }

    return { status: "OK", message: "Session valid" };

});
