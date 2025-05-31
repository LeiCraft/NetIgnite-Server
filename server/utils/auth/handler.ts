import type { H3Event } from 'h3';
import { SessionHandler } from './sessions';
import type { DBStorage } from '@/server/db';

export type UserAuthInfo = {
    userID: number;
    role: DBStorage.User.Model.Role;
};

export class AuthHandler {

    static useAuth(event: H3Event): UserAuthInfo | false {
        // @todo implement Remote API authentication

        return SessionHandler.isAuthenticatedSession(event) satisfies UserAuthInfo | false;
    }

}
