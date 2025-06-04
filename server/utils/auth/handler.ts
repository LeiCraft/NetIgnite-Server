import type { H3Event } from 'h3';
import { SessionHandler } from './sessions';
import type { DBStorage } from '@/server/db';
import bcrypt from 'bcrypt';

export interface UserAuthInfo {
    userID: number;
    username: string;
    role: DBStorage.User.Model.Role;
    favorites: number[];
};

export interface APIUserInfo extends UserAuthInfo {
    adminMode: false | "admin" | "superadmin";
};

export class AuthHandler {

    static useAuth(event: H3Event): APIUserInfo | false {
        // @todo implement Remote API authentication

        const session = SessionHandler.isAuthenticatedSession(event);
        if (!session) return false;

        let adminMode: false | "admin" | "superadmin" = false;

        if (session.role === "admin" && getQuery(event).adminMode === "true") {
            adminMode = session.userID === 1 ? "superadmin" : "admin";
        }
        return {
            ...structuredClone(session),
            adminMode
        };
    }

    static async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

}
