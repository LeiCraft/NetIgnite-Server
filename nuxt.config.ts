// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },

    routeRules: {
        '/dashboard': { redirect: '/' }
    },

    app: {
        head: {
            charset: "utf-8",
			viewport: "width=device-width, initial-scale=1, maximum-scale=1",
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css'
                },
                { rel: "preconnect", href: "https://fonts.googleapis.com" },
				{ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
				{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800;900&display=swap" },

				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
            ],
            script: [
                {
                    src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/js/bootstrap.bundle.min.js',
                    tagPosition: 'bodyClose'
                }
            ]
            
        }
    },

    // build: {
    //     transpile: ['@libsql/hrana-client', '@libsql/isomorphic-ws']
    // },

    nitro: {
        preset: 'node-server',
        experimental: {
            websocket: true
        }
    },

});