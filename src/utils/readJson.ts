import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);

export const readJSON = async (path: string) => {
  const data = await readFile(path, "utf-8");
  return JSON.parse(data);
};
