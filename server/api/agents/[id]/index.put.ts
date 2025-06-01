import { DBStorage } from "../../../db";

type UpdatePayload = DBStorage.Agent.Model;

export default defineEventHandler(async (event) => {

    const userinfo = event.context.userinfo as UserAuthInfo;
    if (!userinfo) return;

    const payload = await readBody(event) as UpdatePayload | undefined;
    if (
        !payload ||
        typeof payload.name !== "string" ||
        typeof payload.description !== "string" ||
        !["server", "microcontroller"].includes(payload.type) ||
        typeof payload.secret !== "string"
    ) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid payload" };
    }

    const agentID = parseInt(getRouterParam(event, "id") as string, 10);
    if (Number.isNaN(agentID) && !Number.isSafeInteger(agentID)) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid Agent ID" };
    }

    payload.ownerID = userinfo.userID;
    payload.id = agentID;

    const result = await DBStorage.Agents.updateByOwner(payload);
    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to update Agent" };
    }

    setResponseStatus(event, 201);
    return { status: "OK", message: "Agent updated successfully" };
});