import {Document, Model, Mongoose, Types} from "mongoose";

export interface User {
  id: string;
  name: string;
  age: number;
}
export type MongoUser = Document<unknown, {}, User> & User & { _id: Types.ObjectId } & { __v: number }

export interface ConnectOptions {
  uri: string;
  connectionAttempts?: number;
}
export interface UserRepository {
  client: Mongoose;
  model: Model<User>;
}