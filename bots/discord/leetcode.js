import dotenv from "dotenv";
import { LeetCode } from "leetcode-query";
import { notify } from "./messageParser.js";
import { configdb } from "../db/configdb.js";
import { EMOTES } from "./EMOTES.js";
import { randomfrom } from "../tools/tools.js";
const leetcode = new LeetCode();
dotenv.config();

let IS_TRACKING_LEETCODE_DAILY_CHALLENGE = await configdb.get(
	"IS_TRACKING_LEETCODE_DAILY_CHALLENGE"
);
let calltimer;
let cached_user = {
	username: process.env.LEETCODE_USERNAME,
	user: await leetcode.get_user(process.env.LEETCODE_USERNAME),
};

async function isuserchached(_username) {
	if (cached_user.username != _username)
		user = await leetcode.get_user(_username);
}
function callEveryMidNight() {
	// Thanks to https://stackoverflow.com/questions/26306090/running-a-function-everyday-midnight
	var now = new Date();
	var night = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() + 1, // the next day, ...
		0,
		0,
		0 // ...at 00:00:00 hours
	);
	var msToMidnight = night.getTime() - now.getTime();

	calltimer = setTimeout(function () {
		isDailyChallengeDone(now.getTime()); //      <-- This is the function being called at midnight.
		callEveryMidNight(); //      Then, reset again next midnight.
	}, msToMidnight);
	/* @log */ console.log("=> Timer set for Midnight");
}

async function isDailyChallengeDone(nowTime) {
	let TIME_DIFF_OF_LAST_SUB =
		nowTime - getLatestSubmissionTime(cached_user.username);
	let TIME_19_HOURS = (25200 + 43200) * 1000;

	let user_id = process.env.USER_ID;
	let reminder_message = {
		msg: `<@${ user_id }>, Yay! You completed today's Daily Challenge`,
		emote: EMOTES[randomfrom(EMOTES.COOL)],
	};

	if (TIME_DIFF_OF_LAST_SUB > TIME_19_HOURS)
		// if didn't completed the challenge then change the message
		reminder_message = {
			msg: `<@${ user_id }>, Oh! No you Forgot to do the Daily Challenge!! `,
			emote: EMOTES[randomfrom[EMOTES.ANGRY]],
		};
	// notify("CHANNEL_REMINDERS", reminder_message.msg);
	notify("CHANNEL_REMINDERS", reminder_message.emote);
}

/*----------------  EXPORTS   --------------*/
export async function startDailyChallengeTracking() {
	return new Promise(async (resolve, reject) => {
		if (IS_TRACKING_LEETCODE_DAILY_CHALLENGE === true)
			resolve("ALREADY_TRACKING");
		else
			await configdb.update("IS_TRACKING_LEETCODE_DAILY_CHALLENGE", true); // update in the database

		IS_TRACKING_LEETCODE_DAILY_CHALLENGE = await configdb.get(
			"IS_TRACKING_LEETCODE_DAILY_CHALLENGE"
		);
		callEveryMidNight();
		return resolve("TRACKING_STARTED");
	});
}
export async function stopDailyChallengeTracking(_username) {
	if (IS_TRACKING_LEETCODE_DAILY_CHALLENGE !== false) {
		/* @log */ console.log("=> Stopping Tracking");

		clearTimeout(calltimer);

		await configdb.update("IS_TRACKING_LEETCODE_DAILY_CHALLENGE", false);

		IS_TRACKING_LEETCODE_DAILY_CHALLENGE = await configdb.get(
			"IS_TRACKING_LEETCODE_DAILY_CHALLENGE"
		);
	}
	return "TRACKING_STOPPED";
}
export async function getDetailsOf(_username) {
	/* @log */ console.log(
	"=> User Data was was fetched for ",
	cached_user.user.matchedUser.username
);
	return cached_user.user;
}

export async function getLatestSubmissionTime(_username) {
	await isuserchached(_username);
	return parseInt(cached_user.user.recentSubmissionList[0].timestamp) * 1000;
}
