import { SessionHandler } from "~/server/utils/sessions";

export default defineNuxtRouteMiddleware((to) => {

    if (to.path.startsWith('/auth')) {

        const sessionID = useCookie('session').value;
        if (!sessionID || !SessionHandler.getActiveSessionAndRefresh(sessionID)) {
            return;
        }
        return navigateTo('/dashboard');
    }

    const sessionID = useCookie('session').value;
    if (!sessionID) {
        return navigateTo('/auth/login');
    }

    const session = SessionHandler.getActiveSessionAndRefresh(sessionID);
    if (!session) {
        return navigateTo('/auth/login');
    }

    useState('session', () => session);
    
});
