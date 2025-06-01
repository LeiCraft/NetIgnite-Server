import { DBStorage } from "../../db";

type CreatePayload = DBStorage.Agent.ModelWithoutID;

export default defineEventHandler(async (event) => {

    // const userinfo = event.context.userinfo as UserAuthInfo;
    // if (!userinfo) return;

    const payload = await readBody(event) as CreatePayload | undefined;
    if (
        !payload ||
        typeof payload.name !== "string" ||
        typeof payload.secret !== "string" ||
        typeof payload.ownerID !== "number"
    ) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "Invalid payload", data: null };
    }

    const ownerIDExists = await DBStorage.Users.getByID(payload.ownerID);
    if (!ownerIDExists) {
        setResponseStatus(event, 400);
        return { status: "ERROR", message: "No matching user found for the given OwnerID", data: null };
    }


    const result = await DBStorage.Agents.insert(payload);
    if (!result) {
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Failed to create Agent", data: null };
    }

    setResponseStatus(event, 201);
    return { status: "OK", message: "Agent created successfully", data: result };
});