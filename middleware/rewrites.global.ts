
export default defineNuxtRouteMiddleware((to) => {

    if (to.path.endsWith('/') && to.path !== '/') {
        // Redirect to the path without the trailing slash  
        return navigateTo(to.path.slice(0, -1), { replace: true });
    }

});
