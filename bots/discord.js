import dotenv from "dotenv";
import Discord from "discord.js";

import { messageParser } from "./discord/messageParser.js";
const BOT_TRIGGER = "\\";
let client = new Discord.Client();
export let channels = client.channels.cache; //set the channels

export function DISCORD_BOT(app, url) {
	dotenv.config();

	return new Promise((resolve, reject) => {
		client.login(process.env.DISCORD_BOT_TOKEN);

		app.get(url, (req, res) => {
			res.send("Discord Running...");
		});

		client.on("ready", () => {
			resolve("Started!");
			console.log("=> Our Discord bot is ready to go..");
		});

		client.on("message", (msg) => {
			console.log(msg.content);
			if (msg.content[0] == BOT_TRIGGER) messageParser(msg, client);
		});
	});
}
export async function logout() {
	await client.off();
}
