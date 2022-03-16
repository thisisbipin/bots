import dotenv from "dotenv";
import { EMOTES } from "./EMOTES.js";
import { channels, logout } from "../discord.js";
import {
	startDailyChallengeTracking,
	stopDailyChallengeTracking,
} from "./leetcode.js";
import { configdb } from "../db/configdb.js";

/*----------------------- MESSAGE FUNCTIONS ------------------------- */
const msgfuncs = {
	track: async function (msg) {
		if ((await startDailyChallengeTracking()) == "ALREADY_TRACKING") {
			msg.reply("I am Tracking you already!");
			msg.channel.send(EMOTES.Scientist_Medal);
		} else if (
			(await startDailyChallengeTracking()) == "TRACKING_STARTED"
		) {
			startDailyChallengeTracking();
			msg.reply("Okay, now you are getting tracked. Tracking Starts!");
			msg.channel.send(EMOTES.Squirtle_Gun);
		}
	},
	notrack: function (msg) {
		stopDailyChallengeTracking();
		msg.reply("Okay, Tracking Stopped!");
		msg.channel.send(EMOTES.Pika_Wink);
	},

	stop: async function (msg) {
		await msg.reply("Stopped!");
		await configdb.update("IS_BOT_ON", false);
		await logout();
	},
};

/*----------------------- EXPORTS ------------------------- */
export function messageParser(msg, client) {
	console.log(msg);
	msg.content = msg.content.substr(1); //remove bot trigger character

	switch (msg.content) {
		case "hey":
			msg.reply(`I am working! ${EMOTES.Pika_Happy}`);
			break;

		case "track":
			msgfuncs.track(msg);
			break;

		case "notrack":
			msgfuncs.notrack(msg);
			break;

		case "stop":
			msgfuncs.stop(msg);
			break;

		default:
			msg.reply(`Oh Damn! The Command was Not found.`);
			msg.channel.send(EMOTES.OhGodOhNo);
	}
}

export async function notify(_channel, message) {
	dotenv.config();
	const current_channel_ID = process.env.CHANNEL_REMINDERS;
	channels.get(current_channel_ID).send(message);
}
