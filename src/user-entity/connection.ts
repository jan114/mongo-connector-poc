import {Mongoose} from "mongoose";
import {
  ConnectOptions,
  ConnectionOptionsMissingError,
  ErrorPredicate
} from "./types";
import {retry} from "./utils";

const connectedStates = [1, 2];
let connectionOptions: ConnectOptions | null = null;
let client: Mongoose | null = null;

/**
 * Initializes the MongoDB connection.
 * @param options - connection options
 */
function init(options: ConnectOptions): void {
  connectionOptions = options;
  console.log("Initialized...");
}

/**
 * Resets the connection options.
 */
function reset(): void {
  connectionOptions = null;
}

/**
 * Checks if the client is connected.
 * @returns true if connected
 */
function isConnected(): boolean {
  return !!client && connectedStates.includes(client?.connection.readyState);
}

/**
 * Predicate to retry on connection errors.
 */
const retryErrors: ErrorPredicate[] = [(e) => e instanceof Error && e.message.includes("ECONNREFUSED")];

/**
 * Retries the connection.
 *
 * @returns connected client
 * @throws ConnectionOptionsMissingError - if connection options are missing
 * @throws Error - if client is not connected
 */
async function retryConnect(): Promise<Mongoose | null> {
  const mongoClient = new Mongoose();
  return await retry(async (): Promise<Mongoose | null> => {
    if (!connectionOptions)
      throw new ConnectionOptionsMissingError(
        "Connection Options have to be specified first; use 'init' function."
      );
    if (isConnected()) return null;
    await mongoClient.connect(connectionOptions.uri, {
      timeoutMS: connectionOptions.timeoutMS,
      connectTimeoutMS: connectionOptions.connectTimeoutMS,
      serverSelectionTimeoutMS: connectionOptions.serverSelectionTimeoutMS,
    });
    return mongoClient;
  }, { forErrors: retryErrors });
}

/**
 * Connects to the MongoDB.
 *
 * @returns connected client
 * @throws ConnectionOptionsMissingError - if connection options are missing
 * @throws Error - if client is not connected
 */
async function connect(): Promise<Mongoose> {
  if (!isConnected())
    client = await retryConnect() ?? client;
  if (!client) throw new Error("Client is not connected");
  return client;
}

/**
 * Closes the MongoDB connection if connected.
 */
async function close() {
  if (isConnected()) {
    await client?.disconnect();
  }
}

/**
 * Exports the connection functions.
 *
 * Example usage:
 * ```typescript
 * import connection from "./connection";
 *
 * // Initialize the connection
 * //   This must be done before connecting to the MongoDB
 * connection.init({
 *   uri: "mongodb://localhost:27017/user-entity",
 *   timeoutMS: 5000,
 *   connectTimeoutMS: 2000,
 *   serverSelectionTimeoutMS: 2000,
 * });
 *
 * // Connect to the MongoDB
 * //   If the init function is not called before, this will throw an error
 * await connection.connect();
 *
 * // Close the connection
 * //   This should be done when the application is shutting down
 * await connection.close();
 * ```
 */
export default {
  init,
  isConnected,
  connect,
  reset,
  close,
};