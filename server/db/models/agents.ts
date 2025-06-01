import { AbstractIDWithOwnerIDBasedTable } from "./base";

export namespace AgentsTable {

    export interface Model {
        id: number;
        name: string;
        type: Model.Type;
        description: string;
        secret: string;
        ownerID: number;
    }

    export namespace Model {
        export type Type = "server" | "microcontroller";
    }

    export type ModelWithoutID = Omit<Model, "id">;
}

export class AgentsTable extends AbstractIDWithOwnerIDBasedTable<AgentsTable.Model> {

    public readonly tableName = "agents";

    public createTable() {
        return `
            CREATE TABLE IF NOT EXISTS agents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('server', 'microcontroller')),
                description TEXT NOT NULL,
                secret TEXT NOT NULL,
                ownerID INTEGER NOT NULL,
                FOREIGN KEY (ownerID) REFERENCES users(id)
            );
        `;
    }

    async updateByOwner(agent: AgentsTable.Model) {
        try {
            const stmt = await this.db.execute({
                sql: `
                    UPDATE agents
                    SET name = ?, type = ?, description = ?, secret = ?, ownerID = ?
                    WHERE id = ? AND ownerID = ?
                `,
                args: [agent.name, agent.type, agent.description, agent.secret, agent.ownerID, agent.id, agent.ownerID]
            });
            // stmt.run(agent.name, agent.secret, agent.id);
            // stmt.finalize();
            return true;
        } catch (error) {
            console.error("Error updating agent:", error);
            return null;
        }
    }

    async insert(agent: AgentsTable.ModelWithoutID) {
        try {
            if (!this.db) throw new Error("Database not initialized");

            const stmt = await this.db.execute({
                sql: `INSERT INTO agents (name, type, description, secret, ownerID) VALUES (?, ?, ?, ?, ?)`,
                args: [agent.name, agent.type, agent.description, agent.secret, agent.ownerID]
            });
            return Number(stmt.lastInsertRowid);
            // stmt.run(agent.name, agent.secret);
            // stmt.finalize();
        } catch (error) {
            console.error("Error inserting agent:", error);
            return null;
        }
    }

}
