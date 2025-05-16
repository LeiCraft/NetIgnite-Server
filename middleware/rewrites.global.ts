
export default defineNuxtRouteMiddleware((to) => {

    if (to.path.endsWith('/')) {
        return navigateTo(to.path.slice(0, 1), { replace: true });
    }

});
