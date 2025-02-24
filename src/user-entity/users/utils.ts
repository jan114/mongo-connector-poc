import {MongoUser, User, UserModel} from "./types";
import connection from "../connection";

let instance: UserModel | null = null;

export default async function getUserModel(): Promise<UserModel> {
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

export function mapUserData(data: MongoUser): User {
  return {
    id: data.id,
    name: data.name,
    age: data.age,
  };
}