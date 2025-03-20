import userEntity from "../src/user-entity/index";
import {User} from "../src/user-entity/users/types";
import {Confirm} from "../src/user-entity/confirm/types";
import {v4} from "uuid";
import {CountryCode, Language, Platform, RegisteredUserResult} from "../src/handlers/types";
import handlers from "../src/handlers/user-register";
import fetchMock from "jest-fetch-mock";


const userFactory = ({
  id = v4(),
  version = Date.now(),
  email = "test@test.local",
  password = "aaa",
  passwordType = "BCRYPT",
  state = "active",
  profile = {
    id: v4(),
    version: Date.now(),
    platformUserId: "123",
    platformId: Platform.HEU,
    countryCode: CountryCode.CZ,
    newsletterSubscription: true,
    language: Language.CS,
    phone: "+420123456789",
  },
}={}): User => ({
  id,
  version,
  email,
  password,
  passwordType,
  state,
  profile: {
    id: profile.id,
    version: profile.version,
    platformUserId: profile.platformUserId,
    platformId: profile.platformId,
    countryCode: profile.countryCode,
    newsletterSubscription: profile.newsletterSubscription,
    language: profile.language,
    phone: profile.phone,
  },
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

describe("handle register user", () => {
  const user: User = userFactory();
  fetchMock.mockIf(/^https:\/\/localhost:1234.+/, async (req) => {
    if (req.url.endsWith(`/v2/default_tenant_assign/${user.id}`))
      return { status: 200, body: JSON.stringify({ok: true}) };
    return { status: 404, body: JSON.stringify({ok: false}) };
  });

  it("succeed", async () => {
    const {
      user: registeredUser,
      confirm: userConfirm
    }: RegisteredUserResult = await handlers.registerUser({
      email: user.email,
      password: "aaaBBB123&_",
      countryCode: CountryCode.CZ,
      platformId: Platform.HEU,
      newsletter: true,
      language: Language.CS,
      activationCallbackUrl: "http://localhost:3000/activate",
    });

    expect(registeredUser.email).toStrictEqual(user.email);

    const getUserResult: User | null = await userEntity.users.getById(registeredUser.id);

    expect(getUserResult).not.toBeNull();
    expect(user.email).toStrictEqual(getUserResult?.email);

    const getConfirmResult: Confirm | null = await userEntity.confirm.getById(userConfirm.id);

    expect(getConfirmResult).not.toBeNull();
    expect(getConfirmResult?.userId).toStrictEqual(registeredUser.id);
  });

  it("password validation error", async () => {
    try {
      await handlers.registerUser({
        email: user.email,
        password: "aaa",
        countryCode: CountryCode.CZ,
        platformId: Platform.HEU,
        newsletter: true,
        language: Language.CS,
        activationCallbackUrl: "http://localhost:3000/activate",
      });
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(Error);
      if (e instanceof Error)
        expect(e.message).toStrictEqual("Password validation error");
    }
  });
});