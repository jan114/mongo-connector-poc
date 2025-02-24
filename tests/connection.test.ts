import userEntity from "../src/user-entity/index";
import {ConnectionOptionsMissingError} from "../src/user-entity/types";


const safeCatch = async (fn: (() => Promise<unknown>) | Promise<unknown>): Promise<unknown> => {
  try {
    if (fn instanceof Function) await fn();
    else await fn;
    return null;
  } catch (e: unknown) {
    return e;
  }
};

beforeEach(() => {
  userEntity.connection.reset();
});

afterEach(async () => {
  await userEntity.connection.close();
});


describe("connects to the mongodb and...", () => {
  it("it connects", async () => {
    expect(userEntity.connection.isConnected()).toBe(false);

    userEntity.connection.init({ uri: "mongodb://localhost:27017/user-entity" });
    await userEntity.connection.connect();

    expect(userEntity.connection.isConnected()).toBe(true);
  });
  it("it is missing the init", async () => {
    expect(userEntity.connection.isConnected()).toBe(false);
    const error = await safeCatch(userEntity.connection.connect());
    expect(userEntity.connection.isConnected()).toBe(false);

    expect(error).toBeInstanceOf(ConnectionOptionsMissingError);
  });
  it("it reconnects", async () => {
    expect(userEntity.connection.isConnected()).toBe(false);

    userEntity.connection.init({ uri: "mongodb://localhost:27017/user-entity" });
    await userEntity.connection.connect();

    expect(userEntity.connection.isConnected()).toBe(true);

    await userEntity.connection.close();

    expect(userEntity.connection.isConnected()).toBe(false);

    await userEntity.connection.connect();

    expect(userEntity.connection.isConnected()).toBe(true);
  });
});