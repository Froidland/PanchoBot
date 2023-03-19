import { Command } from "../interfaces/command";
import { ping } from "./general";
import { link, profile, unlink } from "./osu";
import { archiveCategory } from "./utility";

export const commandList: Command[] = [
  ping,
  profile,
  link,
  unlink,
  archiveCategory,
];
