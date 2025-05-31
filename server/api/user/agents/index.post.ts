import { SessionHandler } from "../../../utils/auth/sessions";
import { DBStorage } from "../../../db";

type CreatePayload = DBStorage.Agent.ModelWithoutID;

export default defineEventHandler(async (event) => {

    const session = SessionHandler.isAuthenticatedSession(event);
    if (!session) return;

    const payload = await readBody(event) as CreatePayload | undefined;
    if (
        !payload ||
        typeof payload.name !== "string" ||
        typeof payload.secret !== "string" ||
        typeof payload.ownerID !== "number"
    ) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid payload" };
    }

    const ownerIDExists = await DBStorage.Users.getByID(payload.ownerID);
    if (!ownerIDExists) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "No matching user found for the given OwnerID" };
    }


    const result = await DBStorage.Agents.insert(payload);
    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to create Agent" };
    }

    setResponseStatus(event, 201);
    return { status: "OK", message: "Agent created successfully" };
});