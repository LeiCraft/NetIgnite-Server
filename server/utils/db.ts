import { createClient as createDBClient } from "@libsql/client";
import { Client as DBClient } from "@libsql/core/api";
import fs from "fs";

export class DBStorage {

    private static db: DBClient | null = null;

    private constructor() {}

    static async init() {
        if (this.db) return this.db;

        if (!fs.existsSync("./data")) {
            fs.mkdirSync("./data", { recursive: true });
        }

        this.db = createDBClient({
            url: "file:./data/db.sqlite"
        });
        this.setupTables();
    }

    private static async setupTables() {
        if (!this.db) throw new Error("Database not initialized");

        try {

            this.db.execute(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL CHECK(role IN ('admin', 'user'))
                );
            `);

            // this.db.execute(`
            //     CREATE TABLE IF NOT EXISTS sessions (
            //         token TEXT PRIMARY KEY,
            //         userID INTEGER NOT NULL,
            //         expiration_timestamp INTEGER NOT NULL,
            //         FOREIGN KEY (userID) REFERENCES users(id)
            //     );
            // `);

            this.db.execute(`
                CREATE TABLE IF NOT EXISTS password_resets (
                    token TEXT PRIMARY KEY,
                    userid INTEGER NOT NULL,
                    expiration_timestamp INTEGER NOT NULL,
                    FOREIGN KEY (userid) REFERENCES users(id)
                );
            `);

            this.db.execute(`
                CREATE TABLE IF NOT EXISTS agents (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    secret TEXT NOT NULL,
                    ownerID INTEGER NOT NULL,
                    FOREIGN KEY (ownerID) REFERENCES users(id)
                );
            `);

            this.db.execute(`
                CREATE TABLE IF NOT EXISTS devices (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    macAddress TEXT NOT NULL,
                    port INTEGER NOT NULL,
                    agentID INTEGER NOT NULL,
                    ownerID INTEGER NOT NULL,
                    FOREIGN KEY (agentID) REFERENCES agents(id),
                    FOREIGN KEY (ownerID) REFERENCES users(id)
                );
            `);

        } catch (error) {
            console.error("Error setting up database tables:", error);
        }

    }

    private static async getAllFromTable<T>(tableName: DBStorage.Table) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute(`SELECT * FROM ${tableName}`);
        return stmt.rows as T[];
    }

    private static async getByIDFromTable<T>(tableName: DBStorage.ByIDTable, id: number) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `SELECT * FROM ${tableName} WHERE id = ?`,
            args: [id]
        });
        return stmt.rows[0] as T | null;
    }

    private static async deleteByIDFromTable(tableName: DBStorage.ByIDTable, id: number) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = this.db.execute({
            sql: `DELETE FROM ${tableName} WHERE id = ?`,
            args: [id]
        });
        return true;
    }

    private static async getByTokenFromTable<T>(tableName: DBStorage.ByTokenTable, token: string) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `SELECT * FROM ${tableName} WHERE token = ?`,
            args: [token]
        })
        return stmt.rows[0] as T | null;
    }

    private static async deleteByTokenFromTable(tableName: DBStorage.ByTokenTable, token: string) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `DELETE FROM ${tableName} WHERE token = ?`,
            args: [token]
        });
        return true;
    }

    private static async getAllByOwnerIDFromTable<T>(tableName: "agents" | "devices", ownerID: number) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `SELECT * FROM ${tableName} WHERE ownerID = ?`,
            args: [ownerID]
        });
        return stmt.rows as T[];
    }


    static getAllAgents() {
        return this.getAllFromTable<DBStorage.Models.Agent>("agents");
    }

    static getAgentByID(id: number) {
        return this.getByIDFromTable<DBStorage.Models.Agent>("agents", id);
    }

    static getAllAgentsByOwnerID(ownerID: number) {
        return this.getAllByOwnerIDFromTable<DBStorage.Models.Agent>("agents", ownerID);
    }

    static async updateAgent(agent: DBStorage.Models.Agent) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `
                UPDATE agents
                SET name = ?, secret = ?
                WHERE id = ?
            `,
            args: [agent.name, agent.secret, agent.id]
        });
        // stmt.run(agent.name, agent.secret, agent.id);
        // stmt.finalize();
        return true;
    }

    static async insertAgent(agent: DBStorage.ModelWithoutID<DBStorage.Models.Agent>) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `INSERT INTO agents (name, secret) VALUES (?, ?)`,
            args: [agent.name, agent.secret]
        });
        // stmt.run(agent.name, agent.secret);
        // stmt.finalize();
        return true;
    }

    static deleteAgentByID(id: number) {
        return this.deleteByIDFromTable("agents", id);
    }


    static getAllDevices() {
        return this.getAllFromTable<DBStorage.Models.Device>("devices");
    }

    static getDeviceByID(id: number) {
        return this.getByIDFromTable<DBStorage.Models.Device>("devices", id);
    }

    static getAllDevicesByOwnerID(ownerID: number) {
        return this.getAllByOwnerIDFromTable<DBStorage.Models.Device>("devices", ownerID);
    }

    static async updateDevice(device: DBStorage.Models.Device) {
        if (!this.db) throw new Error("Database not initialized");

        // const stmt = this.db.prepare(`
        //     UPDATE devices
        //     SET name = ?, macAddress = ?, port = ?, agentID = ?
        //     WHERE id = ?
        // `);
        // stmt.run(device.name, device.macAddress, device.port, device.agentID, device.id);

        const stmt = await this.db.execute({
            sql: `
                UPDATE devices
                SET name = ?, macAddress = ?, port = ?, agentID = ?
                WHERE id = ?
            `,
            args: [device.name, device.macAddress, device.port, device.agentID, device.id]
        });

        // stmt.finalize();
        return true;
    }

    static async insertDevice(device: DBStorage.ModelWithoutID<DBStorage.Models.Device>) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `
                INSERT INTO devices (name, macAddress, port, agentID, ownerID)
                VALUES (?, ?, ?, ?, ?)
            `,
            args: [device.name, device.macAddress, device.port, device.agentID, device.ownerID]
        });
        // stmt.run(device.name, device.macAddress, device.port, device.agentID);
        // stmt.finalize();
        return true;
    }

    static deleteDeviceByID(id: number) {
        return this.deleteByIDFromTable("devices", id);
    }


    static getAllUsers() {
        return this.getAllFromTable<DBStorage.Models.User>("users");
    }

    static getUserByID(id: number) {
        return this.getByIDFromTable<DBStorage.Models.User>("users", id);
    }

    static async getUserByUsername(username: string) {
        if (!this.db) throw new Error("Database not initialized");

        // const stmt = this.db.prepare(`SELECT * FROM users WHERE username = ?`);
        // const row = stmt.get(username);
        // stmt.finalize();
        const stmt = await this.db.execute({
            sql: `SELECT * FROM users WHERE username = ?`,
            args: [username]
        });

        return stmt.rows[0] as any as DBStorage.Models.User | null;
    }

    static async updateUser(user: DBStorage.Models.User) {
        if (!this.db) throw new Error("Database not initialized");
        
        const stmt = await this.db.execute({
            sql: `
                UPDATE users
                SET username = ?, password_hash = ?, role = ?
                WHERE id = ?
            `,
            args: [user.username, user.password_hash, user.role, user.id]
        });
        // stmt.run(user.username, user.password_hash, user.role, user.id);
        // stmt.finalize();
        return true;
    }

    static async insertUser(user: DBStorage.ModelWithoutID<DBStorage.Models.User>) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `
                INSERT INTO users (username, password_hash, role)
                VALUES (?, ?, ?)
            `,
            args: [user.username, user.password_hash, user.role]
        });
        // stmt.run(user.username, user.password_hash, user.role);
        // stmt.finalize();
        return true;
    }

    static deleteUserByID(id: number) {
        return this.deleteByIDFromTable("users", id);
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


    static getAllPasswordResets() {
        return this.getAllFromTable<DBStorage.Models.PasswordReset>("password_resets");
    }

    static async getActivePasswordResetByToken(token: string) {
        const data = await this.getByTokenFromTable<DBStorage.Models.PasswordReset>("password_resets", token);
        if (!data) return null;

        if (Date.now() > data.expiration_timestamp) {
            this.deletePasswordResetByToken(token);
            return null;
        }
        return data;
    }

    static async insertPasswordReset(passwordReset: DBStorage.Models.PasswordReset) {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute({
            sql: `
                INSERT INTO password_resets (token, userID, expiration_timestamp)
                VALUES (?, ?, ?)
            `,
            args: [passwordReset.token, passwordReset.userID, passwordReset.expiration_timestamp]
        });
        // stmt.run(passwordReset.token, passwordReset.userID, passwordReset.expiration_timestamp);
        // stmt.finalize();
        return true;
    }

    static deletePasswordResetByToken(token: string) {
        return this.deleteByTokenFromTable("password_resets", token);
    }

    static async clearAllPasswordResets() {
        if (!this.db) throw new Error("Database not initialized");

        const stmt = await this.db.execute(`DELETE FROM password_resets`);
        // stmt.run();
        // stmt.finalize();
        return true;
    }

}

export namespace DBStorage {

    export interface IConfig {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
    }

    export type ByIDTable = "agents" | "devices" | "users";
    export type ByTokenTable = /*"sessions"*/ | "password_resets";
    export type Table = ByIDTable | ByTokenTable;

    export type ModelWithoutID<T> = Omit<T, "id">;

    export namespace Models {

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
        //     userID: number;
        //     expiration_timestamp: number;
        // }
        export interface PasswordReset {
            token: string;
            userID: number;
            expiration_timestamp: number;
        }

        export interface Agent {
            id: number;
            name: string;
            secret: string;
            ownerID: number;
        }

        export interface Device {
            id: number;
            name: string;
            macAddress: string;
            port: number;
            agentID: number;
            ownerID: number;
        }

    }
}