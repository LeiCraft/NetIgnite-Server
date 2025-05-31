import { AbstractTokenBasedTable } from "./base";

export namespace PasswordResetsTable {

    export interface Model {
        token: string;
        userID: number;
        expiration_timestamp: number;
    }

    export type ModelWithoutID = Omit<Model, "token">;
}

export class PasswordResetsTable extends AbstractTokenBasedTable<PasswordResetsTable.Model> {

    public readonly tableName = "password_resets";

    public createTable() {
        return `
            CREATE TABLE IF NOT EXISTS password_resets (
                token TEXT PRIMARY KEY,
                userid INTEGER NOT NULL,
                expiration_timestamp INTEGER NOT NULL,
                FOREIGN KEY (userid) REFERENCES users(id)
            );
        `;
    }

    async getByToken(token: string) {
        const result = await super.getByToken(token);
        if (!result) return null;

        if (Date.now() > result.expiration_timestamp) {
            await this.deleteByToken(token);
            return null;
        }

        return result as PasswordResetsTable.Model;
    }

    async insert(passwordReset: PasswordResetsTable.Model) {
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

    async clearAllPasswordResets() {
        try {
            const stmt = await this.db.execute(`DELETE FROM password_resets`);
            return true;
        } catch (error) {
            console.error("Error clearing all password resets:", error);
            return false;
        }
    }

}
