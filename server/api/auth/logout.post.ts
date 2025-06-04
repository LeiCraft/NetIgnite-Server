import { SessionHandler } from '~/server/utils/auth/sessions';


export default defineEventHandler(async (event) => {

    const sessionID = getCookie(event, 'session');
    if (sessionID) {
        SessionHandler.destroySession(sessionID);
        deleteCookie(event, 'session');
    }

    setResponseStatus(event, 200);
    return { status: 'OK', message: 'Logged out successfully' };

});
