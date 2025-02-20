import {MongoUser, User, UserModel} from "./types.js";
import connection from "../connection.js";

let instance: UserModel | null = null;


async function create(user: User): Promise<User> {
  while (true) {
    try {
      const model = await getModel();
      return mapUserData(await model.create(user));
    } catch (e) {
      console.log("Corrupted connection; trying again");
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}

async function getById(id: string): Promise<User | null> {
  const model = await getModel();
  const user = await model.findOne({id: id});
  return user && mapUserData(user);
}

async function get(): Promise<User[]> {
  const model = await getModel();
  const users = await model.find();
  return users.map(mapUserData);
}

async function clear(): Promise<void> {
  const model = await getModel();
  await model.deleteMany({});
}


async function getModel(): Promise<UserModel> {
  if (!connection.isConnected() || !instance) {
    const client = await connection.connect();
    const schema = new client.Schema<User>({
      id: {
        type: String,
        unique: true,
      },
      name: String,
      age: Number,
    });
    instance = client.model<User>("User", schema);
  }
  if (!instance) throw new Error("Model couldn't be initialized");
  return instance;
}

function mapUserData(data: MongoUser): User {
  return {
    id: data.id,
    name: data.name,
    age: data.age,
  }
}


export * from "./types.js";
export default {
  create,
  getById,
  get,
  clear,
}