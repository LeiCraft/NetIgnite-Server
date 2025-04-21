// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    nitro: {
        preset: 'bun',
    },

    experimental: {
        // websocket: true
    }

});
curl -fsSL https://host.leicraftmc.de/assets/create-github-history-commit.sh | bash -s -- "2025-01-01 12:00:00" "update"