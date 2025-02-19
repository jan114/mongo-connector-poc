import {Mongoose} from "mongoose";
import { ConnectOptions, MongoUser, User, UserRepository } from "./types.js";

const connectedStates = [1, 2];
let connectionOptions: ConnectOptions;
let instance: UserRepository;


function init(options: ConnectOptions): void {
  connectionOptions = options;
  console.log("Initialized...")
}

function isConnected(): boolean {
  return instance?.client && connectedStates.includes(instance?.client.connection.readyState);
}

async function connect(): Promise<UserRepository> {
  if (!isConnected()) {
    console.log("Connecting...")
    if (!connectionOptions)
      throw new Error(
        "Connection Options have to be specified first; use 'init' function."
      );
    const {uri} = connectionOptions;
    const client = new Mongoose();
    const attempts = 5;
    for (let i = 0; i < attempts; i++) {
      try {
        if (isConnected()) {
          console.log("Already connected...");
          return instance;
        }
        await client.connect(uri);
      } catch (e) {
        if (i === attempts - 1) throw e;
        console.log(`Cannot establish the connection... retrying [${i + 1}/${attempts}]`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    const schema = new client.Schema<User>({
      id: {
        type: String,
        unique: true,
      },
      name: String,
      age: Number,
    });
    const model = client.model<User>("User", schema);

    console.log("Connected...")

    instance = {client, model};
  }

  return instance;
}

async function close() {
  if (isConnected()) {
    console.log("Disconnecting...");
    await instance.client.disconnect();
    console.log("Disconnected...");
  }
}

function mapUserData(data: MongoUser): User {
  return {
    id: data.id,
    name: data.name,
    age: data.age,
  }
}

async function create(user: User): Promise<User> {
  while (true) {
    try {
      const repo = await connect();
      return mapUserData(await repo.model.create(user));
    } catch (e) {
      console.log("Corrupted connection; trying again");
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }
}

async function getById(id: string): Promise<User | null> {
  const repo = await connect();
  const result = await repo.model.findOne({id: id});
  return result && mapUserData(result);
}

async function get(): Promise<User[]> {
  const repo = await connect();
  const users = await repo.model.find();
  return users.map(mapUserData);
}

async function clear(): Promise<void> {
  const repo = await connect();
  await repo.model.deleteMany({});
}

export * from "./types.js";
export default {
  methods: {
    create,
    getById,
    get,
    clear,
  },
  connection: {
    init,
    isConnected,
    connect,
    close,
  },
}