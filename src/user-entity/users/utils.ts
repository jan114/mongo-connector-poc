import {MongoUser, User, UserModel} from "./types";
import connection from "../connection";

let instance: UserModel | null = null;

export default async function getUserModel(): Promise<UserModel> {
  if (!connection.isConnected() || !instance) {
    const client = await connection.connect();
    const schema = new client.Schema<MongoUser>(
      {
        _id: { type: String, required: true },
        version: Number,
        email: String,
        password: String,
        passwordType: String,
        state: String,
        profile: {
          id: String,
          version: Number,
          platformUserId: String,
          platformId: String,
          countryCode: String,
          newsletterSubscription: Boolean,
          language: String,
          phone: {
            type: String,
            required: false
          },
        },
      },
      {
        timestamps: true,
        _id: false,
      }
    );
    instance = client.model<MongoUser>("User", schema);
  }
  if (!instance) throw new Error("Model couldn't be initialized");
  return instance;
}

export function mapUserData(data: MongoUser): User {
  return {
    id: data._id,
    version: data.version,
    email: data.email,
    password: data.password,
    passwordType: data.passwordType,
    state: data.state,
    profile: {
      id: data.profile.id,
      version: data.profile.version,
      platformUserId: data.profile.platformUserId,
      platformId: data.profile.platformId,
      countryCode: data.profile.countryCode,
      newsletterSubscription: data.profile.newsletterSubscription,
      language: data.profile.language,
      phone: data.profile.phone,
    },
  };
}