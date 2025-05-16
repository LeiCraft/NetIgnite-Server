
export default defineNuxtRouteMiddleware((to) => {

    if (!to.path.endsWith('/')) {
        return navigateTo(to.path + '/', { replace: true });
    }

});
