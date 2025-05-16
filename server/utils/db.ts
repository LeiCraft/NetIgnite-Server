import { Database } from "bun:sqlite";

export class DBStorage {

    private static db: Database | null = null;

    private constructor() {}

    static async init() {
        if (this.db) return this.db;

        this.db = new Database("./data/db.sqlite");
        this.setupTables();
    }

    private static setupTables() {
        if (!this.db) throw new Error("Database not initialized");

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS agents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                secret TEXT NOT NULL
            );
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                macAddress TEXT NOT NULL,
                port INTEGER NOT NULL,
                agentId INTEGER NOT NULL,
                FOREIGN KEY (agentId) REFERENCES agents(id)
            );
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
            );
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                userId INTEGER NOT NULL,
                expiration_timestamp INTEGER NOT NULL,
                FOREIGN KEY (userId) REFERENCES users(id)
            );
        `);

        this.db.exec(`
            CREATE TABLE IF NOT EXISTS password_resets (
                token TEXT PRIMARY KEY,
                userid INTEGER NOT NULL,
                expiration_timestamp INTEGER NOT NULL,
                FOREIGN KEY (userid) REFERENCES users(id)
            );
        `);
    }

    private static getAllFromTable<T>(tableName: DBStorage.Table): T[] {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`SELECT * FROM $table`);
        const rows = stmt.all({ $table: tableName });
        stmt.finalize();
        return rows as T[];
    }

    private static getByIdFromTable<T>(tableName: DBStorage.ByIDTable, id: number): T | null {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`SELECT * FROM $table WHERE id = ?`);
        const row = stmt.get(id, { $table: tableName });
        stmt.finalize();
        return row as T | null;
    }

    private static deleteByIdFromTable(tableName: DBStorage.ByIDTable, id: number) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`DELETE FROM $table WHERE id = ?`);
        stmt.run(id, { $table: tableName });
        stmt.finalize();
        return true;
    }

    private static getByTokenFromTable<T>(tableName: DBStorage.ByTokenTable, token: string) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`SELECT * FROM $table WHERE token = ?`);
        const row = stmt.get(token, { $table: tableName });
        stmt.finalize();
        return row as T | null;
    }

    private static deleteByTokenFromTable(tableName: DBStorage.ByTokenTable, token: string) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`DELETE FROM $table WHERE token = ?`);
        stmt.run(token, { $table: tableName });
        stmt.finalize();
        return true;
    }


    static getAllAgents() {
        return this.getAllFromTable<DBStorage.Models.Agent>("agents");
    }

    static getAgentById(id: number) {
        return this.getByIdFromTable<DBStorage.Models.Agent>("agents", id);
    }

    static updateAgent(agent: DBStorage.Models.Agent) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`
            UPDATE agents
            SET name = ?, secret = ?
            WHERE id = ?
        `);
        stmt.run(agent.name, agent.secret, agent.id);
        stmt.finalize();
        return true;
    }

    static insertAgent(agent: DBStorage.Models.Agent) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`
            INSERT INTO agents (name, secret)
            VALUES (?, ?)
        `);
        stmt.run(agent.name, agent.secret);
        stmt.finalize();
        return true;
    }

    static deleteAgentById(id: number) {
        return this.deleteByIdFromTable("agents", id);
    }


    static getAllDevices() {
        return this.getAllFromTable<DBStorage.Models.Device>("devices");
    }

    static getDeviceById(id: number) {
        return this.getByIdFromTable<DBStorage.Models.Device>("devices", id);
    }

    static updateDevice(device: DBStorage.Models.Device) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`
            UPDATE devices
            SET name = ?, macAddress = ?, port = ?, agentId = ?
            WHERE id = ?
        `);
        stmt.run(device.name, device.macAddress, device.port, device.agentId, device.id);
        stmt.finalize();
        return true;
    }

    static insertDevice(device: DBStorage.Models.Device) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`
            INSERT INTO devices (name, macAddress, port, agentId)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(device.name, device.macAddress, device.port, device.agentId);
        stmt.finalize();
        return true;
    }

    static deleteDeviceById(id: number) {
        return this.deleteByIdFromTable("devices", id);
    }


    static getAllUsers() {
        return this.getAllFromTable<DBStorage.Models.User>("users");
    }

    static getUserById(id: number) {
        return this.getByIdFromTable<DBStorage.Models.User>("users", id);
    }

    static getUserByUsername(username: string) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`SELECT * FROM users WHERE username = ?`);
        const row = stmt.get(username);
        stmt.finalize();
        return row as DBStorage.Models.User | null;
    }

    static updateUser(user: DBStorage.Models.User) {
        if (!this.db) throw new Error("Database not initialized");
        
        const stmt = this.db.prepare(`
            UPDATE users
            SET username = ?, password_hash = ?, role = ?
            WHERE id = ?
        `);
        stmt.run(user.username, user.password_hash, user.role, user.id);
        stmt.finalize();
        return true;
    }

    static insertUser(user: DBStorage.Models.User) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`
            INSERT INTO users (username, password_hash, role)
            VALUES (?, ?, ?)
        `);
        stmt.run(user.username, user.password_hash, user.role);
        stmt.finalize();
        return true;
    }

    static deleteUserById(id: number) {
        return this.deleteByIdFromTable("users", id);
    }


    // static getAllSessions() {
    //     return this.getAllFromTable<DBStorage.Models.Session>("sessions");
    // }

    // static getSessionByToken(token: string) {
    //     return this.getByTokenFromTable<DBStorage.Models.Session>("sessions", token);
    // }

    // static insertSession(session: DBStorage.Models.Session) {
    //     if (!this.db) throw new Error("Database not initialized");

    //     const stmt = this.db.prepare(`
    //         INSERT INTO sessions (token, userId, expiration_timestamp)
    //         VALUES (?, ?, ?)
    //     `);
    //     stmt.run(session.token, session.userId, session.expiration_timestamp);
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


    static getAllPasswordResets() {
        return this.getAllFromTable<DBStorage.Models.PasswordReset>("password_resets");
    }

    static getActivePasswordResetByToken(token: string) {
        const data =  this.getByTokenFromTable<DBStorage.Models.PasswordReset>("password_resets", token);
        if (!data) return null;

        if (Date.now() > data.expiration_timestamp) {
            this.deletePasswordResetByToken(token);
            return null;
        }
        return data;
    }

    static insertPasswordReset(passwordReset: DBStorage.Models.PasswordReset) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`
            INSERT INTO password_resets (token, userId, expiration_timestamp)
            VALUES (?, ?, ?)
        `);
        stmt.run(passwordReset.token, passwordReset.userId, passwordReset.expiration_timestamp);
        stmt.finalize();
        return true;
    }

    static deletePasswordResetByToken(token: string) {
        return this.deleteByTokenFromTable("password_resets", token);
    }

    static clearAllPasswordResets() {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.prepare(`DELETE FROM password_resets`);
        stmt.run();
        stmt.finalize();
        return true;
    }

}

export namespace DBStorage {

    export type ByIDTable = "agents" | "devices" | "users";
    export type ByTokenTable = /*"sessions"*/ | "password_resets";
    export type Table = ByIDTable | ByTokenTable;


    export namespace Models {
        export interface Agent {
            id: number;
            name: string;
            secret: string;
        }

        export interface Device {
            id: number;
            name: string;
            macAddress: string;
            port: number;
            agentId: number;
        }

        export interface User {
            id: number;
            username: string;
            password_hash: string;
            role: User.Role;
        }
        export namespace User {
            export type Role = "admin" | "user";
        }
        // export interface Session {
        //     token: string;
        //     userId: number;
        //     expiration_timestamp: number;
        // }
        export interface PasswordReset {
            token: string;
            userId: number;
            expiration_timestamp: number;
        }
    }
}