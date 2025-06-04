import { SessionStore } from "@/utils/userStore";
import { useAPI } from "@/composables/useAPI";

export default defineNuxtRouteMiddleware(async(to) => {

    if (to.path.startsWith('/auth')) {

        const response = await useAPI('/api/auth/session');

        if (response.status !== 'OK' || !response.data) {
            return;
        }

        SessionStore.setUserInfo(response.data);

        return navigateTo('/');
    }

    const response = await useAPI('/api/auth/session');

    if (response.status !== 'OK' || !response.data) {
        return navigateTo('/auth/login?url=' + encodeURIComponent(to.fullPath));
    }

    SessionStore.setUserInfo(response.data);

    return;
});
