import type { H3Event } from 'h3';
import { SessionHandler } from './sessions';

export type UserAuthInfo = {
    userID: number;
    role: DBStorage.Models.User.Role;
};

export class AuthHandler {

    static useAuth(event: H3Event): UserAuthInfo | false {
        // @todo implement Remote API authentication

        return SessionHandler.isAuthenticatedSession(event) satisfies UserAuthInfo | false;
    }

}
