import {Mongoose} from "mongoose";
import {ConnectOptions} from "./types.js";

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

async function connect(): Promise<Mongoose> {
  if (!isConnected()) {
    console.log("Connecting...")
    if (!connectionOptions)
      throw new Error(
        "Connection Options have to be specified first; use 'init' function."
      );
    const {uri} = connectionOptions;
    const mongoClient = new Mongoose();
    const attempts = 5;
    for (let i = 0; i < attempts; i++) {
      try {
        if (isConnected()) {
          console.log("Already connected...");
          return mongoClient;
        }
        await mongoClient.connect(uri);
      } catch (e) {
        if (i === attempts - 1) throw e;
        console.log(`Cannot establish the connection... retrying [${i + 1}/${attempts}]`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    console.log("Connected...")

    client = mongoClient;
  }

  if (!client) throw new Error("Client is not connected");

  return client;
}

async function close() {
  if (isConnected()) {
    console.log("Disconnecting...");
    await client?.disconnect();
    console.log("Disconnected...");
  }
}

export default {
  init,
  isConnected,
  connect,
  close
};