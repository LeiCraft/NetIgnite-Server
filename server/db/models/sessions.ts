

        // export interface Session {
        //     token: string;
        //     userID: number;
        //     expiration_timestamp: number;
        // }

            // this.db.execute(`
            //     CREATE TABLE IF NOT EXISTS sessions (
            //         token TEXT PRIMARY KEY,
            //         userID INTEGER NOT NULL,
            //         expiration_timestamp INTEGER NOT NULL,
            //         FOREIGN KEY (userID) REFERENCES users(id)
            //     );
            // `);

    // static getAllSessions() {
    //     return this.getAllFromTable<DBStorage.Models.Session>("sessions");
    // }

    // static getSessionByToken(token: string) {
    //     return this.getByTokenFromTable<DBStorage.Models.Session>("sessions", token);
    // }

    // static insertSession(session: DBStorage.Models.Session) {
    //     if (!this.db) throw new Error("Database not initialized");

    //     const stmt = this.db.prepare(`
    //         INSERT INTO sessions (token, userID, expiration_timestamp)
    //         VALUES (?, ?, ?)
    //     `);
    //     stmt.run(session.token, session.userID, session.expiration_timestamp);
    //     stmt.finalize();
    //     return true;
    // }

    // static clearAllSessions() {
    //     if (!this.db) throw new Error("Database not initialized");

    //     const stmt = this.db.prepare(`DELETE FROM sessions`);
    //     stmt.run();
    //     stmt.finalize();
    //     return true;
    // }
