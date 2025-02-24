import {MongoUser, User, UserModel, UserUpdate} from "./types";
import getModel, {mapUserData} from "./utils";
import {DeleteResult, UpdateWriteOpResult} from "mongoose";


async function create(user: User): Promise<User> {
  const model: UserModel = await getModel();
  return mapUserData(await model.create(user));
}

async function update(id: string, user: UserUpdate): Promise<boolean> {
  const model: UserModel = await getModel();
  const result: UpdateWriteOpResult = await model.updateOne({id}, user);
  return result.modifiedCount === 1;
}

async function getById(id: string): Promise<User | null> {
  const model: UserModel = await getModel();
  const user: MongoUser | null = await model.findOne({id});
  return user && mapUserData(user);
}

async function get(): Promise<User[]> {
  const model: UserModel = await getModel();
  const users: MongoUser[] = await model.find();
  return users.map(mapUserData);
}

async function removeById(id: string): Promise<boolean> {
  const model: UserModel = await getModel();
  const result: DeleteResult = await model.deleteOne({id});
  return result.deletedCount === 1;
}

async function clear(): Promise<void> {
  const model: UserModel = await getModel();
  await model.deleteMany({});
}

export default {
  create,
  update,
  getById,
  get,
  removeById,
  clear,
};