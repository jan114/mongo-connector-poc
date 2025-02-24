import userEntity from "../src/user-entity/index";
import {User} from "../src/user-entity/users/types";


const userFactory = (name: string, age: number): User => ({
  id: crypto.randomUUID(),
  name,
  age,
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
  const user: User = userFactory("Test User", 79);

  it("creates user", async () => {
    const result: User = await userEntity.users.create(user);

    expect(result).toStrictEqual(user);
  });

  it("creates multiple users and gets them", async () => {
    const users: User[] = [user, userFactory("Test User 2", 30)];
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
    it("updates user", async () => {
      const updatedUser: User = {...user, name: "Updated User"};
      const resultUpdate: boolean = await userEntity.users.update(updatedUser.id, {name: updatedUser.name});
      const resultGet: User | null = await userEntity.users.getById(updatedUser.id);

      expect(resultUpdate).toBe(true);
      expect(resultGet).toStrictEqual(updatedUser);
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