import { AbstractIDBasedTable } from "./base";


export namespace UsersTable {

    interface BaseModel {
        id: number;
        username: string;
        password_hash: string;
        role: Model.Role;
    }

    export interface Model extends BaseModel {
        favorites: number[];
    }

    export type ModelWithoutID = Omit<Model, "id">;

    export namespace Model {
        export type Role = "admin" | "user";
    }

    export interface StoredModel extends BaseModel {
        favorites: string; // JSON string of array
    }

    export type StoredModelWithoutID = Omit<StoredModel, "id">;

}

export class UsersTable extends AbstractIDBasedTable<UsersTable.Model> {

    public readonly tableName = "users";

    public createTable() {
        return `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
                favorites TEXT NOT NULL DEFAULT ''
            );
        `;
    }

    async getByUsername(username: string) {
        try {
            const stmt = await this.db.execute({
                sql: `SELECT * FROM users WHERE username = ?`,
                args: [username]
            });

            return this.decode(stmt.rows[0] as any as UsersTable.Model || null);
        } catch (error) {
            console.error("Error getting user by username:", error);
            return null;
        }
    }

    async update(user: UsersTable.Model) {
        try {
            const stmt = await this.db.execute({
                sql: `
                    UPDATE users
                    SET username = ?, password_hash = ?, role = ?, favorites = ?
                    WHERE id = ?
                `,
                args: [user.username, user.password_hash, user.role, JSON.stringify(user.favorites), user.id]
            });
            // stmt.run(user.username, user.password_hash, user.role, user.id);
            // stmt.finalize();
            return true;
        } catch (error) {
            console.error("Error updating user:", error);
            return null;
        }
    }

    async insert(user: UsersTable.ModelWithoutID) {
        try {
            const stmt = await this.db.execute({
                sql: `
                    INSERT INTO users (username, password_hash, role, favorites)
                    VALUES (?, ?, ?, ?)
                `,
                args: [user.username, user.password_hash, user.role, JSON.stringify(user.favorites)]
            });

            return Number(stmt.lastInsertRowid);
        } catch (error) {
            console.error("Error inserting user:", error);
            return null;
        }
    }

}
