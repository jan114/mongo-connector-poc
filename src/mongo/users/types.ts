import {Document, Model, Types} from "mongoose";

export interface User {
  id: string;
  name: string;
  age: number;
}
export type UserModel = Model<User>;
export type MongoUser = Document<unknown, object, User> & User & { _id: Types.ObjectId } & { __v: number };