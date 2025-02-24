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


function init(options: ConnectOptions): void {
  connectionOptions = options;
  console.log("Initialized...");
}

function reset(): void {
  connectionOptions = null;
}

function isConnected(): boolean {
  return !!client && connectedStates.includes(client?.connection.readyState);
}

const retryErrors: ErrorPredicate[] = [(e) => e instanceof Error && e.message.includes("ECONNREFUSED")];
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

async function connect(): Promise<Mongoose> {
  if (!isConnected())
    client = await retryConnect() ?? client;
  if (!client) throw new Error("Client is not connected");
  return client;
}

async function close() {
  if (isConnected()) {
    await client?.disconnect();
  }
}

export default {
  init,
  isConnected,
  connect,
  reset,
  close,
};