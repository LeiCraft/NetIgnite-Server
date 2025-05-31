import { DBStorage } from '../server/db';
import bcrypt from 'bcrypt';

await DBStorage.init();

const myuser: DBStorage.User.ModelWithoutID = {
    username: "admin",
    password_hash: await bcrypt.hash("123456", 10),
    role: "admin",
    favorites: []
}

await DBStorage.Users.insert(myuser);
