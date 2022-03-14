import dotenv from "dotenv";
import Discord from "discord.js";

import { messageParser } from "./discord/messageParser.js";
const BOT_TRIGGER = "\\";
let client;

export function DISCORD_BOT(app, url) {
  dotenv.config();
  client = new Discord.Client();
  app.get(url, (req, res) => {
    res.send("Discord Running...");
  });

  client.on("ready", () => {
    console.log("=> Our Discord bot is ready to go..");
  });

  client.on("message", (msg) => {
    console.log(msg.content);
    if (msg.content[0] == BOT_TRIGGER) messageParser(msg);
  });

  client.login(process.env.DISCORD_BOT_TOKEN);
}
export async function logout() {
  await client.off();
}
