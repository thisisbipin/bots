import express from "express";
const app = express();
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { DISCORD_BOT } from "./bots/discord.js";
import { startDailyChallengeTracking } from "./bots/discord/leetcode.js";
import { configdb } from "./bots/db/configdb.js";
import { set_webHook_reciever } from "./autopull.js";
import { keepawake, stopsite } from "./wake.js";
import { notify } from "./bots/discord/messageParser.js";

app.use(express.static("public"));
app.use(bodyParser.json());
app.get("/", function (req, res) {
	res.send("Hello World");
});

app.get("/startbots", (request, response) => {
	try {
		START_BOTS();
	} catch (error) {
		response.send(error.message);
	}
	response.send("Bots were Started");
});
// All the bots here
async function START_BOTS() {
	/* @log */ console.log("=> Bots were Started");

	if ((await configdb.get("IS_BOT_ON")) != true)
		await configdb.update("IS_BOT_ON", true);

	await DISCORD_BOT(app, "/discord/");
	// TELEGRAM__BOT(app, "/telegram/", axios);

	setTimeout(() => {
		notify("CHANNEL_REMINDERS", "Bots were started");
	}, 5000); //manual delay of 5s
}

//Initialization
if ((await configdb.get("IS_BOT_ON")) == true) await START_BOTS();
if ((await configdb.get("IS_TRACKING_LEETCODE_DAILY_CHALLENGE")) == true)
	startDailyChallengeTracking();

//Listener
app.listen(5000, async () => {
	console.log("Running at port", 5000);
});

// wehookereciever
set_webHook_reciever(app);

app.get("/keepawake", (req, res) => {
	dotenv.config();
	keepawake(process.env.SELF_URL, true);
	res.send("Okay Now the project will be awake");
});
app.get("/stopsite", (req, res) => {
	res.send(stopsite(true));
});

//for by default keeping awake
keepawake();
