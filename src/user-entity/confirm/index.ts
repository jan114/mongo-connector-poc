import {Confirm, ConfirmModel, MongoConfirm} from "./types";
import getModel, {mapUserData} from "./utils";


async function create(confirm: Confirm): Promise<Confirm> {
  const model: ConfirmModel = await getModel();
  return mapUserData(await model.create(confirm));
}

async function getById(id: string): Promise<Confirm | null> {
  const model: ConfirmModel = await getModel();
  const confirm: MongoConfirm | null = await model.findOne({id: id});
  return confirm && mapUserData(confirm);
}

async function get(): Promise<Confirm[]> {
  const model: ConfirmModel = await getModel();
  const confirms: MongoConfirm[] = await model.find();
  return confirms.map(mapUserData);
}

async function clear(): Promise<void> {
  const model: ConfirmModel = await getModel();
  await model.deleteMany({});
}


export default {
  create,
  getById,
  get,
  clear,
};