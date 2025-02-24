import {Model} from "mongoose";
import {MongoEntity} from "../types";

export interface Confirm {
  id: string;
  name: string;
  age: number;
}
export type ConfirmModel = Model<Confirm>;
export type MongoConfirm = MongoEntity<Confirm>;