import { UserAuthInfo } from "@/server/utils/auth/handler";
import { DBStorage } from "@/server/db";

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    const agentID = parseInt(getRouterParam(event, "id") as string, 10);
    if (Number.isNaN(agentID) && !Number.isSafeInteger(agentID)) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid Agent ID" };
    }

    const agent = await DBStorage.Agents.getByID(agentID);
    if (!agent || agent.ownerID !== userinfo.userID) {
        setResponseStatus(event, 404);
        return { status: "ERROR", message: "Agent not found or inaccessible by user" };
    }

    const result = await DBStorage.Agents.deleteByID(agentID);

    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to delete Agent" };
    }

    setResponseStatus(event, 200);
    return { status: "OK", message: "Agent deleted successfully" };
});
