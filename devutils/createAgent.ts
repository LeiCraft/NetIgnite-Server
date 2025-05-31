import { DBStorage } from '../server/db';

await DBStorage.init();

const agent: DBStorage.Agent.ModelWithoutID = {
    name: "Test Agent",
    type: "microcontroller",
    description: "This is a test agent",
    secret: "123456",
    ownerID: 1
}

await DBStorage.Agents.insert(agent);
