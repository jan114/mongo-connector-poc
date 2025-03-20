import passwords from "./passwords";
import userEntity from "../user-entity";
import {User} from "../user-entity/users/types";
import {Confirm} from "../user-entity/confirm/types";
import {v4, v5} from "uuid";
import {
  CountryCode,
  EntityName,
  EntityUUIDNamespaceParams,
  EntityUUIDParams,
  Input,
  PasswordData,
  Platform, RegisteredUserResult
} from "./types";
import confirmToken from "./confirm-token";
import {ConfirmationType} from "../user-entity/confirm/types";
import hellcat from "../services/hellcat";


export function getEntityUUIDNamespace({
  entityName,
  platformId,
  countryCode,
}: EntityUUIDNamespaceParams): string {
  const namespaceName = `${platformId}.${entityName}.${countryCode}`.toLowerCase();
  return v5(namespaceName, v5.DNS);
}
export function precomputeEntityUUIDNamespaces(
  platforms: Platform[],
  countryCodes: CountryCode[],
  entityNames: string[]
): Record<string, string> {
  return Object.fromEntries(
    platforms.flatMap((platformId) =>
      countryCodes.flatMap((countryCode) =>
        entityNames.map((entityName) => [
          `${platformId}.${entityName}.${countryCode}`,
          getEntityUUIDNamespace({ entityName, platformId, countryCode }),
        ])
      )
    )
  );
}
export const precomputedUserEntityMap = precomputeEntityUUIDNamespaces(
  Object.values(Platform),
  Object.values(CountryCode),
  [EntityName.USER]
);

export function getEntityUUID5({
  entityName,
  namespaceMap,
  entityRecordId,
  countryCode,
  platformId,
}: EntityUUIDParams): string {
  const namespace = namespaceMap[`${platformId}.${entityName}.${countryCode}`];
  return v5(entityRecordId, namespace);
}

export function getUserUUID(userData?: {
  platformUserId?: string
  countryCode: CountryCode
  platformId: Platform
}): string {
  if (!userData || !userData.platformUserId)
    return v4();

  return getEntityUUID5({
    ...userData,
    entityName: EntityName.USER,
    namespaceMap: precomputedUserEntityMap,
    entityRecordId: userData.platformUserId,
  });
}
export const monthsToMilliseconds = (months: number) => months * 30 * 24 * 3600 * 1000;
export const generateExpiresAt = () => new Date(Date.now() + monthsToMilliseconds(6));


async function handleRegisterUser(input: Input): Promise<RegisteredUserResult> {
  const passwordData: PasswordData = passwords.create(input.password);

  const existingUser: User | null = await userEntity.users.getByEmail(input.email);
  if (existingUser)
    throw new Error("User already registered");

  const profile = {
    platformUserId: "123",
    countryCode: input.countryCode,
    platformId: input.platformId,
    newsletterSubscription: input.newsletter,
    version: Date.now(),
    language: input.language,
  };
  const profileId: string = getUserUUID(profile);

  const user: User = await userEntity.users.create({
    id: v4(),
    version: Date.now(),
    email: input.email,
    password: passwordData.hash,
    passwordType: passwordData.type,
    profile: { id: profileId, ...profile },
    state: "pending-registration",
  });
  const confirm: Confirm = await userEntity.confirm.create({
    id: v4(),
    version: Date.now(),
    confirmToken: confirmToken.create(user.id, user.version),
    userId: user.id,
    expiresAt: generateExpiresAt(),
    isActive: true,
    type: ConfirmationType.REGISTRATION,
  });

  await hellcat.setDefaultTenants(user.id);

  return { user, confirm };
}

export default {registerUser: handleRegisterUser};