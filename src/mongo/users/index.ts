import {User} from "./types.js";
import getModel, {mapUserData} from "./utils.js";
import connection from "../connection.js";


async function create(user: User): Promise<User> {
  const model = await getModel();
  return mapUserData(await model.create(user));
}

async function getById(id: string): Promise<User | null> {
  const model = await getModel();
  const user = await model.findOne({id: id});
  return user && mapUserData(user);
}

async function get(): Promise<User[]> {
  const model = await getModel();
  const users = await model.find();
  return users.map(mapUserData);
}

async function clear(): Promise<void> {
  const model = await getModel();
  await model.deleteMany({});
}


export * from "./types.js";
export default {
  create,
  getById,
  get,
  clear,
};