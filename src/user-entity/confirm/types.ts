import {Model} from "mongoose";
import {MongoEntity} from "../types";

export enum ConfirmationType {
  REGISTRATION = "registration",
  INVITE = "checkout-register",
  REGISTRATION_AGAIN = "registration-again",
  PASSWORD_RESET = "password-reset",
}
export interface Confirm {
  id: string
  version: number
  confirmToken: string
  userId: string
  expiresAt: Date
  isActive: boolean
  type: ConfirmationType.REGISTRATION | ConfirmationType.PASSWORD_RESET | ConfirmationType.INVITE | ConfirmationType.REGISTRATION_AGAIN
}
export type MongoConfirm = MongoEntity<Confirm>;
export type ConfirmModel = Model<MongoConfirm>;