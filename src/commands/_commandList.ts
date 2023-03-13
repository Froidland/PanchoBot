import { Command } from "../interfaces/command";
import { ping } from "./general";
import { link, profile } from "./osu";

export const commandList: Command[] = [ping, profile, link];
