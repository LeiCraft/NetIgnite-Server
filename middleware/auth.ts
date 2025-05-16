
export default defineNuxtRouteMiddleware((to) => {

    if (to.path.startsWith('/auth')) {

        const { data, error } = useFetch('/api/user/auth/session');

        if (error.value || data.value?.status !== 'OK') {
            return navigateTo('/auth/login');
        }

        return navigateTo('/dashboard');
    }

    const { data, error } = useFetch('/api/user/auth/session');

    if (error.value || data.value?.status !== 'OK') {
        return navigateTo('/auth/login');
    }
    
});
