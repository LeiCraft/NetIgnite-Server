import { DBStorage } from '../server/utils/db';

await DBStorage.init();

const agent: DBStorage.ModelWithoutID<DBStorage.Models.Agent> = {
    name: "Test Agent",
    secret: "123456"
}

await DBStorage.insertAgent(agent);
