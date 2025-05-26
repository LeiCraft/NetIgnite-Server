
export default defineNuxtRouteMiddleware(async(to) => {

    if (to.path.startsWith('/auth')) {

        const { data, error } = await useFetch('/api/user/auth/session');

        if (error.value || data.value?.status !== 'OK') {
            return;
        }

        return navigateTo('/');
    }

    const { data, error } = await useFetch('/api/user/auth/session');

    if (error.value || data.value?.status !== 'OK') {
        return navigateTo('/auth/login');
    }

    return;
});
