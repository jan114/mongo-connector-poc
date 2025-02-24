import {Confirm} from "./types";
import getModel, {mapUserData} from "./utils";


async function create(confirm: Confirm): Promise<Confirm> {
  const model = await getModel();
  return mapUserData(await model.create(confirm));
}

async function getById(id: string): Promise<Confirm | null> {
  const model = await getModel();
  const confirm = await model.findOne({id: id});
  return confirm && mapUserData(confirm);
}

async function get(): Promise<Confirm[]> {
  const model = await getModel();
  const confirms = await model.find();
  return confirms.map(mapUserData);
}

async function clear(): Promise<void> {
  const model = await getModel();
  await model.deleteMany({});
}


export default {
  create,
  getById,
  get,
  clear,
};