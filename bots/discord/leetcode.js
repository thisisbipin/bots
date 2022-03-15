import { LeetCode } from "leetcode-query";
import nedb from "nedb";

const leetcode = new LeetCode();
const database = new nedb("config.db");
database.loadDatabase();

export let IS_TRACKING_LEETCODE_DAILY_CHALLENGE = false;
let calltimer;
let cached_user = {
	username: "thisisbipin",
	user: await leetcode.get_user("thisisbipin"),
};
//Initiazlization
database.find(
	{ property: "IS_TRACKING_LEETCODE_DAILY_CHALLENGE" },
	(err, data) => {
		IS_TRACKING_LEETCODE_DAILY_CHALLENGE = data[0].value;

		if (IS_TRACKING_LEETCODE_DAILY_CHALLENGE == true) {
			console.log("=> Auto Calling startDailyChallengeTracking()");
			startDailyChallengeTracking();
		}
	}
);

// console.log(cached_user.user);

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

function isDailyChallengeDone(nowTime) {
	let TIME_DIFF_OF_LAST_SUB =
		nowTime - getLatestSubmissionTime(cached_user.username);
	let TIME_19_HOURS = (25200 + 43200) * 1000;
	if (TIME_DIFF_OF_LAST_SUB > TIME_19_HOURS)
		return {
			code: "NOTDONE",
			msg: "Oh No! You forgot to do the Daily Challenge!",
		};
	else
		return {
			code: "DONE",
			msg: "Yay! You did it",
		};
}

/*----------------  EXPORTS   --------------*/
export function startDailyChallengeTracking() {
	if (IS_TRACKING_LEETCODE_DAILY_CHALLENGE === true)
		return "ALREADY_TRACKING";
	const config = {
		property: "IS_TRACKING_LEETCODE_DAILY_CHALLENGE",
		value: true,
	};
	database.update(
		{ property: "IS_TRACKING_LEETCODE_DAILY_CHALLENGE" },
		config,
		(err, data) =>
			console.log("=> Database value was successfully set as", config)
	);
	IS_TRACKING_LEETCODE_DAILY_CHALLENGE = true;
	callEveryMidNight();
	return "TRACKING_STARTED";
}
export function stopDailyChallengeTracking(_username) {
	if (IS_TRACKING_LEETCODE_DAILY_CHALLENGE !== false) {
		// await isuserchached(_username);
		/* @log */ console.log("=> Stopping Tracking");
		clearTimeout(calltimer);
		const config = {
			property: "IS_TRACKING_LEETCODE_DAILY_CHALLENGE",
			value: false,
		};
		database.update(
			{ property: "IS_TRACKING_LEETCODE_DAILY_CHALLENGE" },
			config,
			(err, data) =>
				console.log("=> Database value was successfully set as", config)
		);
		IS_TRACKING_LEETCODE_DAILY_CHALLENGE = false;
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
