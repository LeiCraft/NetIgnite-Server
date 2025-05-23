import { SessionHandler } from "../../../../utils/sessions";

export default defineEventHandler(async (event) => {

    const session = SessionHandler.isAuthenticatedSession(event);
    if (!session) return;

    const agentID = parseInt(getRouterParam(event, "id") as string, 10);
    if (Number.isNaN(agentID) && !Number.isSafeInteger(agentID)) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid Agent ID" };
    }

    const agent = await DBStorage.getAgentByID(agentID);
    if (!agent || agent.ownerID !== session.userID) {
        setResponseStatus(event, 404);
        return { status: "ERROR", message: "Agent not found or inaccessible by user" };
    }

    const result = await DBStorage.deleteAgentByID(agentID);

    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to delete Agent" };
    }

    setResponseStatus(event, 200);
    return { status: "OK", message: "Agent deleted successfully" };
});
