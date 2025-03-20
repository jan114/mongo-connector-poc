import {Document} from "mongoose";

/**
 * Connection options for the MongoDB connection.
 */
export interface ConnectOptions {
  uri: string;
  connectionAttempts?: number;
  timeoutMS?: number;
  connectTimeoutMS?: number;
  serverSelectionTimeoutMS?: number;
}

/**
 * Entity interface for MongoDB entities.
 */
export type MongoEntity<T> = Document<unknown, object, T> & T & { _id: string } & { __v: number };

/**
 * Error thrown when connection options are missing.
 */
export class ConnectionOptionsMissingError extends Error {}


/**
 * Predicate to determine if an error should be retried.
 */
export type ErrorPredicate = (e: unknown) => boolean;

/**
 * Retry options for the retry mechanism.
 */
export interface RetryOptions {
  attempts?: number;
  delay?: number;
  forErrors?: ErrorPredicate[];
}