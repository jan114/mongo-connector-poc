import {User} from "./types";
import getModel, {mapUserData} from "./utils";


async function create(user: User): Promise<User> {
  const model = await getModel();
  return mapUserData(await model.create(user));
}

async function getById(id: string): Promise<User | null> {
  const model = await getModel();
  const user = await model.findOne({id});
  return user && mapUserData(user);
}

async function get(): Promise<User[]> {
  const model = await getModel();
  const users = await model.find();
  return users.map(mapUserData);
}

async function removeById(id: string): Promise<boolean> {
  const model = await getModel();
  const result = await model.deleteOne({id});
  return result.deletedCount === 1;
}

async function clear(): Promise<void> {
  const model = await getModel();
  await model.deleteMany({});
}


export default {
  create,
  getById,
  get,
  removeById,
  clear,
};