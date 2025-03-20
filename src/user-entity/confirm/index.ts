import {Confirm, ConfirmModel, MongoConfirm} from "./types";
import getModel, {mapConfirmData} from "./utils";


async function create(confirm: Confirm): Promise<Confirm> {
  const model: ConfirmModel = await getModel();
  return mapConfirmData(await model.create({_id: confirm.id, ...confirm}));
}

async function getById(id: string): Promise<Confirm | null> {
  const model: ConfirmModel = await getModel();
  const confirm: MongoConfirm | null = await model.findOne({_id: id});
  return confirm && mapConfirmData(confirm);
}

async function get(): Promise<Confirm[]> {
  const model: ConfirmModel = await getModel();
  const confirms: MongoConfirm[] = await model.find();
  return confirms.map(mapConfirmData);
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