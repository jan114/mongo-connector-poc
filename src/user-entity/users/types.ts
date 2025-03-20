import {Model} from "mongoose";
import {MongoEntity} from "../types";

import {CountryCode, Language, Platform} from "../../handlers/types";

export interface Profile {
  id: string
  version: number
  platformUserId: string
  platformId: Platform
  countryCode: CountryCode
  newsletterSubscription: boolean
  language: Language
  phone?: string
}

export interface User {
  id: string;
  version: number,
  email: string,
  password: string,
  passwordType: string,
  state: string,
  profile: Profile,
}

export type MongoUser = Omit<MongoEntity<User>, "id">;
export type UserModel = Model<MongoUser>;