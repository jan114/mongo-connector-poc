import {Mongoose} from "mongoose";
import {ConnectOptions, ErrorPredicate} from "./types.js";
import {retry} from "./utils.js";

const connectedStates = [1, 2];
let connectionOptions: ConnectOptions;
let client: Mongoose | null = null;


function init(options: ConnectOptions): void {
  connectionOptions = options;
  console.log("Initialized...");
}

function isConnected(): boolean {
  return !!client && connectedStates.includes(client?.connection.readyState);
}

const retryErrors: ErrorPredicate[] = [(e) => e instanceof Error && e.message.includes("ECONNREFUSED")];
async function retryConnect(): Promise<Mongoose | null> {
  if (!connectionOptions)
    throw new Error(
      "Connection Options have to be specified first; use 'init' function."
    );
  const mongoClient = new Mongoose();
  return await retry(async (): Promise<Mongoose | null> => {
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
  close,
};