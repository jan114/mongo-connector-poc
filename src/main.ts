import mongo from "./user-entity/index";
import {User} from "./user-entity/users/types";
import process from "node:process";
import exitHandler from "./exit-handler";
import {v4} from "uuid";

import {CountryCode, Language, Platform} from "./handlers/types";

async function main(): Promise<void> {
  mongo.connection.init({
    uri: "mongodb://localhost:27017/user-entity",
    timeoutMS: 5000,
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 2000,
  });

  const usersArray: User[] = [
    {
      id: v4(),
      version: Date.now(),
      email: "test@test.local",
      password: "aaa",
      passwordType: "BCRYPT",
      profile: {
        id: v4(),
        version: Date.now(),
        platformUserId: "123",
        platformId: Platform.HEU,
        countryCode: CountryCode.CZ,
        newsletterSubscription: true,
        language: Language.CS,
      },
      state: "active",
    },
    {
      id: v4(),
      version: Date.now(),
      email: "test@test.local",
      password: "aaa",
      passwordType: "BCRYPT",
      profile: {
        id: v4(),
        version: Date.now(),
        platformUserId: "123",
        platformId: Platform.HEU,
        countryCode: CountryCode.CZ,
        newsletterSubscription: true,
        language: Language.CS,
      },
      state: "active",
    },
    {
      id: v4(),
      version: Date.now(),
      email: "test@test.local",
      password: "aaa",
      passwordType: "BCRYPT",
      profile: {
        id: v4(),
        version: Date.now(),
        platformUserId: "123",
        platformId: Platform.HEU,
        countryCode: CountryCode.CZ,
        newsletterSubscription: true,
        language: Language.CS,
      },
      state: "active",
    },
    {
      id: v4(),
      version: Date.now(),
      email: "test@test.local",
      password: "aaa",
      passwordType: "BCRYPT",
      profile: {
        id: v4(),
        version: Date.now(),
        platformUserId: "123",
        platformId: Platform.HEU,
        countryCode: CountryCode.CZ,
        newsletterSubscription: true,
        language: Language.CS,
      },
      state: "active",
    },
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

