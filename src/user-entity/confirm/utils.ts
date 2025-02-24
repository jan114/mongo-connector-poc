import {Confirm, ConfirmModel, MongoConfirm} from "./types";
import connection from "../connection";

let instance: ConfirmModel | null = null;

export default async function getConfirmModel(): Promise<ConfirmModel> {
  if (!connection.isConnected() || !instance) {
    const client = await connection.connect();
    const schema = new client.Schema<Confirm>({
      id: {
        type: String,
        unique: true,
      },
      name: String,
      age: Number,
    });
    instance = client.model<Confirm>("Confirm", schema);
  }
  if (!instance) throw new Error("Model couldn't be initialized");
  return instance;
}

export function mapUserData(data: MongoConfirm): Confirm {
  return {
    id: data.id,
    name: data.name,
    age: data.age,
  }
}