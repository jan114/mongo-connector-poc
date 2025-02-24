import {Model} from "mongoose";
import {MongoEntity} from "../types";

export interface User {
  id: string;
  name: string;
  age: number;
}
export type UserModel = Model<User>;
export type MongoUser = MongoEntity<User>;