import { SessionStore } from "~/utils/userStore";

export default defineNuxtRouteMiddleware(async(to) => {

    if (to.path.startsWith('/auth')) {

        const { data, error } = await useFetch('/api/auth/session');

        if (error.value || data.value?.status !== 'OK') {
            return;
        }

        SessionStore.setUserInfo((data.value as any).data);

        return navigateTo('/');
    }

    const { data, error } = await useFetch('/api/auth/session');

    if (error.value || data.value?.status !== 'OK') {
        return navigateTo('/auth/login');
    }

    SessionStore.setUserInfo((data.value as any).data);

    return;
});
