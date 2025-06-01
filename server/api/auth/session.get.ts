import { getCookie } from "h3";

export default defineEventHandler(async (event) => {

    const sessionID = getCookie(event, 'session');
    if (!sessionID) {
        setResponseStatus(event, 401);
        return { status: "ERROR", message: "No session found", data: null  };
    }

    const session = SessionHandler.getActiveSessionAndRefresh(sessionID);
    if (!session) {
        setResponseStatus(event, 401);
        return { status: "ERROR", message: "Invalid session", data: null };
    }

    return { status: "OK", message: "Session valid", data: session };

});
