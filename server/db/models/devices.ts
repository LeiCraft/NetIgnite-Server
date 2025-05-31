import { AbstractIDWithOwnerIDBasedTable } from "./base";

export namespace DevicesTable {

    export interface Model {
        id: number;
        name: string;
        macAddress: string;
        port: number;
        agentID: number;
        ownerID: number;
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
                macAddress TEXT NOT NULL,
                port INTEGER NOT NULL,
                agentID INTEGER NOT NULL,
                ownerID INTEGER NOT NULL,
                FOREIGN KEY (agentID) REFERENCES agents(id),
                FOREIGN KEY (ownerID) REFERENCES users(id)
            );
        `;
    }

    async update(device: DevicesTable.Model) {
        try {
            const stmt = await this.db.execute({
                sql: `
                    UPDATE devices
                    SET name = ?, macAddress = ?, port = ?, agentID = ?
                    WHERE id = ?
                `,
                args: [device.name, device.macAddress, device.port, device.agentID, device.id]
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
                    INSERT INTO devices (name, macAddress, port, agentID, ownerID)
                    VALUES (?, ?, ?, ?, ?)
                `,
                args: [device.name, device.macAddress, device.port, device.agentID, device.ownerID]
            });

            return true;
        } catch (error) {
            console.error("Error inserting device:", error);
            return null;
        }
    }

}
