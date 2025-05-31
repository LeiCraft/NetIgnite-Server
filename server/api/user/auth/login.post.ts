import { SessionHandler } from '../../../utils/auth/sessions';
import { DBStorage } from '../../../db';
import bcrypt from 'bcrypt';

function noMatchingCredentials(event: any) {
    setResponseStatus(event, 401);
    return { status: "ERROR", message: "No matching credentials found" };
}

export default defineEventHandler(async (event) => {

    try {

        const body = await readBody(event);
        const { username, password } = body;

        if (typeof username !== 'string' || typeof password !== 'string') {
            setResponseStatus(event, 400);
            return { status: "ERROR", message: "Invalid payload" };
        }

        const user = await DBStorage.Users.getByUsername(username);
        if (!user) return noMatchingCredentials(event);

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) return noMatchingCredentials(event);

        const sessionID = SessionHandler.createSession(user);

        setCookie(event, 'session', sessionID, {
            path: '/',
            maxAge: 60 * 60,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        return { status: "OK", message: "Login successful" };

    } catch (error) {
        console.error("Error during login:", error);
        setResponseStatus(event, 500);
        return { status: "ERROR", message: "Internal server error" };
    }
});
