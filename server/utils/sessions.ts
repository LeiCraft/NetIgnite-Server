
export class SessionData {

    private static readonly EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

    constructor(
        readonly userID: number,
        role: DBStorage.Models.User.Role,
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

    private static sessions: Map<string, SessionData> = new Map();

    private constructor() {}

    static createSession(user: DBStorage.Models.User) {

        let sessionID = Bun.randomUUIDv7();
        // Ensure the session ID is unique
        while (this.sessions.has(sessionID)) {
            sessionID = Bun.randomUUIDv7();
        }

        this.sessions.set(sessionID, new SessionData(user.id, user.role));
        return sessionID;
    }

    static getActiveSessionAndRefresh(sessionID: string) {
        const session = this.sessions.get(sessionID);
        if (session) {
            if (session.isExpired()) {
                this.destroySession(sessionID);
                return null;
            }
            session.refresh();
            return session;
        }
        return null;
    }

    static destroySession(sessionID: string) {
        this.sessions.delete(sessionID);
    }

}