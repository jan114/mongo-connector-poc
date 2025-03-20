import userEntity from "../src/user-entity/index";
import {User} from "../src/user-entity/users/types";
import {v4} from "uuid";
import {CountryCode, Language, Platform} from "../src/handlers/types";


const userFactory = (email = "test@test.local"): User => ({
  id: v4(),
  version: Date.now(),
  email,
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
    phone: "+420123456789",
  },
  state: "active",
});


beforeAll(() => {
  userEntity.connection.init({
    uri: "mongodb://localhost:27017/user-entity",
    timeoutMS: 5000,
    connectTimeoutMS: 2000,
    serverSelectionTimeoutMS: 2000,
  });
});

afterEach(async () => {
  await userEntity.users.clear();
  await userEntity.connection.close();
});

describe("connects to the mongodb and...", () => {
  const user: User = userFactory();

  it("creates user", async () => {
    const result: User = await userEntity.users.create(user);

    expect(result).toStrictEqual(user);
  });

  it("creates multiple users and gets them", async () => {
    const users: User[] = [user, userFactory("test@tadyda.local")];
    for (const user of users) await userEntity.users.create(user);

    const resultGetAll: User[] = await userEntity.users.get();

    expect(resultGetAll).toStrictEqual(users);
  });

  describe("creates user and...", () => {
    beforeEach(async () => await userEntity.users.create(user));

    it("gets user", async () => {
      const resultGet: User | null = await userEntity.users.getById(user.id);

      expect(resultGet).toStrictEqual(user);
    });
    it("closes connection and gets user", async () => {
      await userEntity.connection.close();
      const resultGet: User | null = await userEntity.users.getById(user.id);

      expect(resultGet).toStrictEqual(user);
    });
    it("deletes user", async () => {
      const resultGetBefore: User | null = await userEntity.users.getById(user.id);
      const resultDelete: boolean = await userEntity.users.removeById(user.id);
      const resultGetAfter: User | null = await userEntity.users.getById(user.id);

      expect(resultGetBefore).toStrictEqual(user);
      expect(resultDelete).toBe(true);
      expect(resultGetAfter).toBe(null);
    });
  });
});