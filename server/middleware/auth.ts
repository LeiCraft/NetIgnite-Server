import { AuthHandler } from "../utils/auth/handler";

export default defineEventHandler(async (event) => {

    if (!event.node.req.url?.startsWith("/api/") || event.node.req.url?.startsWith("/api/auth") || event.node.req.url?.startsWith("/api/agent-control-service")) {
        // Skip authentication for auth routes
        return;
    }

    const info = AuthHandler.useAuth(event);
    if (!info) return;

    event.context.userinfo = info;
});
