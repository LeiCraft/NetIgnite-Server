import { DBStorage } from '../server/utils/db';
import bcrypt from 'bcrypt';

await DBStorage.init();

const myuser: DBStorage.ModelWithoutID<DBStorage.Models.User> = {
    username: "admin",
    password_hash: await bcrypt.hash("123456", 10),
    role: "admin"
}

await DBStorage.insertUser(myuser)
