import express from "express";
var app = express();
import bodyParser from "body-parser";
import { DISCORD_BOT } from "./bots/discord.js";
import nedb from "nedb";

const configdb = new nedb("config.db");
configdb.loadDatabase();

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
	/* @log */ console.log("=> Bots were Started");
	response.send("Bots were Started");
});
// All the bots here
function START_BOTS() {
	DISCORD_BOT(app, "/discord/");
	// TELEGRAM__BOT(app, "/telegram/", axios);
}

app.listen(5000, async () => {
	console.log("Running at port", 5000);
});

//Initiazlization
configdb.find({ property: "IS_BOT_ON" }, (err, data) => {
	IS_BOT_ON = data[0].value;

	if (IS_BOT_ON == true) {
		console.log("=> Tracking Auto restarting as server was started again.");
		startDailyChallengeTracking();
	}
});
