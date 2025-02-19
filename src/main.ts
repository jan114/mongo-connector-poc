import users, {User} from "./mongo/users/index.js";
import process from "node:process";
import crypto from "node:crypto";

async function main(): Promise<void> {
  users.connection.init({ uri: "mongodb://localhost:27017/users" });

  const usersArray: User[] = [
    { id: crypto.randomUUID(), name: "John Doe", age: 30 },
    { id: crypto.randomUUID(), name: "Jane Doe", age: 25 },
    { id: crypto.randomUUID(), name: "Alice", age: 22 },
    { id: crypto.randomUUID(), name: "Bob", age: 27 },
  ];

  await Promise.all(
    usersArray.map(async (user) => {
      await users.methods.create(user);
      await users.connection.close();
    })
  );

  const allUsers = await users.methods.get();
  console.log("All users:", allUsers);

  await users.methods.clear();
  await users.connection.close();

  process.exit();
}

void main();

