import type { H3Event } from 'h3';
import { SessionHandler } from './sessions';
import type { DBStorage } from '@/server/db';

export interface UserAuthInfo {
    userID: number;
    username: string;
    role: DBStorage.User.Model.Role;
    favorites: number[];
};

export class AuthHandler {

    static useAuth(event: H3Event): UserAuthInfo | false {
        // @todo implement Remote API authentication

        return SessionHandler.isAuthenticatedSession(event);
    }

}
