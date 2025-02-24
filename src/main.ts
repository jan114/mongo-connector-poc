import mongo from "./user-entity/index";
import {User} from "./user-entity/users/types";
import process from "node:process";
import crypto from "node:crypto";
import exitHandler from "./exit-handler";

async function main(): Promise<void> {
  mongo.connection.init({
    uri: "mongodb://localhost:27017/user-entity",
    timeoutMS: 5000,
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 2000,
  });

  const usersArray: User[] = [
    { id: crypto.randomUUID(), name: "John Doe", age: 30 },
    { id: crypto.randomUUID(), name: "Jane Doe", age: 25 },
    { id: crypto.randomUUID(), name: "Alice", age: 22 },
    { id: crypto.randomUUID(), name: "Bob", age: 27 },
  ];

  await Promise.all(
    usersArray.map(async (user) => {
      const result = await mongo.users.create(user);
      console.log("Created user:", result);
      const result2 = await mongo.users.getById(user.id);
      console.log("Found user:", result2);
    })
  );

  const allUsers = await mongo.users.get();
  console.log("All users:", allUsers);

  await mongo.users.clear();

  await exit();
}

async function exit(): Promise<void> {
  await mongo.connection.close();
  process.exit();
}

exitHandler(["uncaughtException", "SIGINT", "SIGTERM"], exit);

void main();

