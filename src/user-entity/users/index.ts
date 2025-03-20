import {MongoUser, User, UserModel} from "./types";
import getModel, {mapUserData} from "./utils";
import {DeleteResult} from "mongoose";


async function create(user: User): Promise<User> {
  const model: UserModel = await getModel();
  return mapUserData(await model.create({_id: user.id, ...user}));
}

async function getById(id: string): Promise<User | null> {
  const model: UserModel = await getModel();
  const user: MongoUser | null = await model.findOne({_id: id});
  return user && mapUserData(user);
}

async function getByEmail(email: string): Promise<User | null> {
  const model: UserModel = await getModel();
  const user: MongoUser | null = await model.findOne({email});
  return user && mapUserData(user);
}

async function get(): Promise<User[]> {
  const model: UserModel = await getModel();
  const users: MongoUser[] = await model.find();
  return users.map(mapUserData);
}

async function removeById(id: string): Promise<boolean> {
  const model: UserModel = await getModel();
  const result: DeleteResult = await model.deleteOne({_id: id});
  return result.deletedCount === 1;
}

async function clear(): Promise<void> {
  const model: UserModel = await getModel();
  await model.deleteMany({});
}

export default {
  create,
  get,
  getById,
  getByEmail,
  removeById,
  clear,
};