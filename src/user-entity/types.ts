import {Document, Types} from "mongoose";

export type ErrorPredicate = (e: unknown) => boolean;

export interface ConnectOptions {
  uri: string;
  connectionAttempts?: number;
  timeoutMS?: number;
  connectTimeoutMS?: number;
  serverSelectionTimeoutMS?: number;
}

export interface RetryOptions {
  attempts?: number;
  delay?: number;
  forErrors?: ErrorPredicate[];
}


export type MongoEntity<T> = Document<unknown, object, T> & T & { _id: Types.ObjectId } & { __v: number };