import mongo from "./mongo/index.js";
import process from "node:process";
import crypto from "node:crypto";
import {User} from "./mongo/users/index.js";
import exitHandler, {ExitSignal} from "./exit-handler.js";

async function main(): Promise<void> {
  mongo.connection.init({ uri: "mongodb://localhost:27017/users" });

  const usersArray: User[] = [
    { id: crypto.randomUUID(), name: "John Doe", age: 30 },
    { id: crypto.randomUUID(), name: "Jane Doe", age: 25 },
    { id: crypto.randomUUID(), name: "Alice", age: 22 },
    { id: crypto.randomUUID(), name: "Bob", age: 27 },
  ];

  await Promise.all(
    usersArray.map(async (user) => {
      await mongo.users.create(user);
      await mongo.connection.close();
    })
  );

  const allUsers = await mongo.users.get();
  console.log("All users:", allUsers);

  await mongo.users.clear();

  throw new Error("Test error");
  await new Promise((resolve) => setTimeout(resolve, 5000));

  await mongo.connection.close();
  process.exit();
}

exitHandler(["uncaughtException", "SIGINT", "SIGTERM"], async () => {
  await mongo.connection.close();
});

void main();

