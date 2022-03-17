import { randomfrom } from "./bots/tools/tools.js";
import { logsdb } from "./bots/db/configdb.js";
import axios from "axios";

let timer;
const PING_TIME = 210000;
const MAX_LOG = 100;
let id = 0;

async function logit(msg) {
	id = (id + 1) % MAX_LOG;
	const logdata = { time: Date() };

	if (msg != undefined) {
		logdata = msg;
	}

	try {
		await logsdb.get(id);
		logsdb.update(id, logdata);
	} catch (err) {
		logsdb.insert(id, logdata);
	}
}

export function keepawake(url, log = false) {
	if (typeof url == "object") url = randomfrom(url);
	timer = setInterval(() => {
		axios.get(url);
		if (log === true) logit();
	}, PING_TIME);
}
export function stopsite(log = false) {
	console.log("=> Stop called");
	clearInterval(timer);
	if (log === true) logit("Site was Stopped");
	return "Stopping site after 5 mins";
}
