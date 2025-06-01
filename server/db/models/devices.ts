import { AbstractIDWithOwnerIDBasedTable } from "./base";

export namespace DevicesTable {

    export interface Model {
        id: number;
        name: string;
        type: Model.Type;
        description: string;
        macAddress: string;
        port: number;
        agentID: number;
        ownerID: number;
    }

    export namespace Model {
        export type Type = 'server' | 'desktop' | 'laptop' | 'printer' | 'nas';
    }

    export type ModelWithoutID = Omit<Model, "id">;
}

export class DevicesTable extends AbstractIDWithOwnerIDBasedTable<DevicesTable.Model> {

    public readonly tableName = "devices";

    public createTable() {
        return `
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                type TEXT NOT NULL CHECK(type IN ('server', 'desktop', 'laptop', 'printer', 'nas')),
                description TEXT,
                macAddress TEXT NOT NULL,
                port INTEGER NOT NULL,
                agentID INTEGER NOT NULL,
                ownerID INTEGER NOT NULL,
                FOREIGN KEY (agentID) REFERENCES agents(id),
                FOREIGN KEY (ownerID) REFERENCES users(id)
            );
        `;
    }

    async updateByOwner(device: DevicesTable.Model) {
        try {
            const stmt = await this.db.execute({
                sql: `
                    UPDATE devices
                    SET name = ?, type = ?, description = ?, macAddress = ?, port = ?, agentID = ?, ownerID = ?
                    WHERE id = ? AND ownerID = ?
                `,
                args: [device.name, device.type, device.description, device.macAddress, device.port, device.agentID, device.ownerID, device.id, device.ownerID]
            });
            return true;
        } catch (error) {
            console.error("Error updating device:", error);
            return null;
        }
    }

    async insert(device: DevicesTable.ModelWithoutID) {
        try {
            if (!this.db) throw new Error("Database not initialized");

            const stmt = await this.db.execute({
                sql: `
                    INSERT INTO devices (name, type, description, macAddress, port, agentID, ownerID)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                args: [device.name, device.type, device.description, device.macAddress, device.port, device.agentID, device.ownerID]
            });

            return Number(stmt.lastInsertRowid);
        } catch (error) {
            console.error("Error inserting device:", error);
            return null;
        }
    }

}
