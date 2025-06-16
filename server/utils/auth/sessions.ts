import { randomBytes } from 'crypto';
import type { H3Event } from 'h3';
import { DBStorage } from '~/server/db';
import type { UserAuthInfo } from './handler';

export class SessionData implements UserAuthInfo {

    private static readonly EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30; // 30 days

    constructor(
        readonly userID: number,
        public username: string,
        public role: DBStorage.User.Model.Role,
        public favorites: number[],
        private expirationTimestamp = Date.now() + SessionData.EXPIRATION_TIME
    ) {}

    public isExpired() {
        return Date.now() > this.expirationTimestamp;
    }

    public refresh() {
        this.expirationTimestamp = Date.now() + SessionData.EXPIRATION_TIME;
    }

    public get expirationTime() {
        return this.expirationTimestamp;
    }

}

export class SessionHandler {

    private static sessions: Map<string, SessionData>;

    private constructor() {}

    private static initialized = false;

    static async init() {
        if (this.initialized) return;
        this.initialized = true;

        this.sessions = new Map<string, SessionData>();
    }

    static createSession(user: DBStorage.User.Model) {
        let sessionID: string = randomBytes(32).toString('hex');
        // Ensure the session ID is unique
        while (this.sessions.has(sessionID)) {
            sessionID = randomBytes(32).toString('hex');
        }

        this.sessions.set(sessionID, new SessionData(user.id, user.username, user.role, user.favorites));
        return sessionID;
    }

    static getActiveSessionAndRefresh(sessionID: string) {
        const session = this.sessions.get(sessionID);
        if (!session) {
            return null;
        }
        if (session.isExpired()) {
            this.destroySession(sessionID);
            return null;
        }
        session.refresh();
        return session;
    }

    static isAuthenticatedSession(event: H3Event) {

        const sessionID = getCookie(event, 'session');
        if (!sessionID) {
            setResponseStatus(event, 401);
            event.node.res.setHeader("Content-Type", "application/json");
            event.node.res.end(JSON.stringify({ status: "ERROR", message: "No session found" }));
            return false;
        }

        const session = this.getActiveSessionAndRefresh(sessionID);
        if (!session) {
            setResponseStatus(event, 401);
            event.node.res.setHeader("Content-Type", "application/json");
            event.node.res.end(JSON.stringify({ status: "ERROR", message: "Invalid session" }));
            return false;
        }

        return session;
    }

    static destroySession(sessionID: string) {
        this.sessions.delete(sessionID);
    }

}