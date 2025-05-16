import { DBStorage } from '../server/utils/db';

await DBStorage.init();

const myuser: DBStorage.ModelWithoutID<DBStorage.Models.User> = {
    username: "admin",
    password_hash: await Bun.password.hash("123456"),
    role: "admin"
}

DBStorage.insertUser(myuser)
