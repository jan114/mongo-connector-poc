import {Document, Model, Mongoose, Types} from "mongoose";

export interface User {
  id: string;
  name: string;
  age: number;
}
export type UserModel = Model<User>;
export type MongoUser = Document<unknown, {}, User> & User & { _id: Types.ObjectId } & { __v: number };