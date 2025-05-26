import { SessionHandler } from "../../utils/sessions";
import { DBStorage } from "../../utils/db";

type CreatePayload = DBStorage.ModelWithoutID<DBStorage.Models.Agent>;

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

    const ownerIDExists = await DBStorage.getUserByID(payload.ownerID);
    if (!ownerIDExists) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "No matching user found for the given OwnerID" };
    }


    const result = await DBStorage.insertAgent(payload);
    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to create Agent" };
    }

    setResponseStatus(event, 201);
    return { status: "OK", message: "Agent created successfully" };
});