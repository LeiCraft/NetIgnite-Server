export default defineNuxtPlugin(() => {
    if (process.env.NODE_ENV === 'production') {
        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (
                typeof args[0] === 'string' &&
                args[0].includes('[Vue Router warn]: No match found for location with path')
            ) {
                return; // Suppress this specific warning
            }
            originalWarn(...args); // Allow all other warnings
        };
    }
});
