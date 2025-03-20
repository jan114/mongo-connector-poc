import {Confirm, ConfirmModel, ConfirmationType, MongoConfirm} from "./types";
import connection from "../connection";

let instance: ConfirmModel | null = null;

export default async function getConfirmModel(): Promise<ConfirmModel> {
  if (!connection.isConnected() || !instance) {
    const client = await connection.connect();
    const schema = new client.Schema<MongoConfirm>(
      {
        _id: { type: String, required: true, unique: true },
        confirmToken: { type: String, required: true, index: true, unique: true },
        userId: { type: String, required: true, index: true },
        version: { type: Number, required: true },
        isActive: { type: Boolean, required: true },
        type: { type: String, required: true, enum: Object.values(ConfirmationType) },
        expiresAt: { type: Date, required: true },
      },
      {
        collection: "confirm",
        timestamps: true,
        _id: false,
      }
    );
    instance = client.model<MongoConfirm>("Confirm", schema);
  }
  if (!instance) throw new Error("Model couldn't be initialized");
  return instance;
}

export function mapConfirmData(data: MongoConfirm): Confirm {
  return {
    id: data._id,
    confirmToken: data.confirmToken,
    userId: data.userId,
    version: data.version,
    isActive: data.isActive,
    type: data.type,
    expiresAt: data.expiresAt,
  };
}