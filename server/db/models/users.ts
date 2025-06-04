import { ResultSet } from "@libsql/client";
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

export class UsersTable extends AbstractIDBasedTable<UsersTable.Model, UsersTable.StoredModel> {

    public readonly tableName = "users";

    protected encode = (item: UsersTable.Model) => {
        const encodedItem = structuredClone(item) as any as UsersTable.StoredModel;
        encodedItem.favorites = JSON.stringify(item.favorites);
        return encodedItem;
    }

    protected decode = (item: UsersTable.StoredModel | null) => {
        if (!item) return null;

        const decodedItem = structuredClone(item) as any as UsersTable.Model;
        decodedItem.favorites = JSON.parse(item.favorites);
        return decodedItem;
    }

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

            return this.decode(stmt.rows[0] as any || null);
        } catch (error) {
            console.error("Error getting user by username:", error);
            return null;
        }
    }

    async isUsernameTaken(username: string, currentOwnerID?: number) {
        try {
            let stmt: ResultSet;

            if (currentOwnerID) {
                stmt = await this.db.execute({
                    sql: `
                        SELECT COUNT(*) as count FROM users
                        WHERE username = ? AND id != ?
                    `,
                    args: [username, currentOwnerID]
                });
            } else {
                stmt = await this.db.execute({
                    sql: `
                        SELECT COUNT(*) as count FROM users
                        WHERE username = ?
                    `,
                    args: [username]
                });
            }
    
            const row = stmt.rows[0] as any;
            return row.count > 0;
        } catch (error) {
            console.error("Error checking if username is taken:", error);
            return false;
        }
    }

    async update(user: Omit<UsersTable.Model, "role" | "password_hash"> & { password?: string, role?: UsersTable.Model.Role }) {
        try {

            if (user.password) {
                const password_hash = await AuthHandler.hashPassword(user.password);

                const stmt = await this.db.execute({
                    sql: `UPDATE users SET password_hash = ? WHERE id = ?`,
                    args: [password_hash, user.id]
                });

            }

            if (user.role) {
                const stmt = await this.db.execute({
                    sql: `UPDATE users SET role = ? WHERE id = ?`,
                    args: [user.role, user.id]
                });
            }

            const stmt = await this.db.execute({
                sql: `
                    UPDATE users
                    SET username = ?, favorites = ?
                    WHERE id = ?
                `,
                args: [user.username, JSON.stringify(user.favorites), user.id]
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
