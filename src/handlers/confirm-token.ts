import {createHash} from "node:crypto";

const md5 = (value: string): string => createHash("md5").update(value).digest("hex");

function create(userId: string, date: number): string {
  const randSuffix: number = Math.floor(Math.random() * 1000000);
  return md5(`${userId}${date}${randSuffix}`);
}

export default {
  create,
};