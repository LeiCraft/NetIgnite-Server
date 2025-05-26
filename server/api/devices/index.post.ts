import { SessionHandler } from '@/server/utils/sessions';
import { DBStorage } from '@/server/utils/db';

type CreatePayload = DBStorage.ModelWithoutID<DBStorage.Models.Device>;

export default defineEventHandler(async (event) => {

    const session = SessionHandler.isAuthenticatedSession(event);
    if (!session) return;

    const payload = await readBody(event) as CreatePayload | undefined;
    if (
        !payload ||
        typeof payload.name !== "string" ||
        typeof payload.macAddress !== "string" ||
        typeof payload.port !== "number" || payload.port < 0 || payload.port > 65535 ||
        typeof payload.agentID !== "number" ||
        typeof payload.ownerID !== "number"
    ) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid payload" };
    }

    const ownerIDExists = await DBStorage.getUserByID(payload.ownerID);
    if (!ownerIDExists) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "No matching user found for the given OwnerID" };
    }

    const agentIDExists = await DBStorage.getAgentByID(payload.agentID);
    if (!agentIDExists) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "No matching agent found for the given AgentID" };
    }

    const result = await DBStorage.insertDevice(payload);
    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to create Device" };
    }

    setResponseStatus(event, 201);
    return { status: "OK", message: "Device created successfully" };
});