import { EMOTES } from "./EMOTES.js";
import { logout } from "../discord.js";
import {
  startDailyChallengeTracking,
  stopDailyChallengeTracking,
} from "./leetcode.js";

export function messageParser(msg) {
  msg.content = msg.content.substr(1); //remove bot trigger character

  switch (msg.content) {
    case "hey":
      msg.reply(`I am working! ${EMOTES.Pika_Happy}`);
      break;

    case "track":
      track(msg);
      break;

    case "notrack":
      notrack(msg);
      break;

    case "stop":
      stop(msg);
      break;

    default:
      msg.reply(`Oh Damn! The Command was Not found.`);
      msg.channel.send(EMOTES.OhGodOhNo);
  }
}

function track(msg) {
  let response = startDailyChallengeTracking();
  if (response === "ALREADY_TRACKING") {
    msg.reply("I am Tracking you already!");
    msg.channel.send(EMOTES.Scientist_Medal);
  } else {
    msg.reply("Okay, now you are getting tracked. Tracking Starts!");
    msg.channel.send(EMOTES.Squirtle_Gun);
  }
}

function notrack(msg) {
  stopDailyChallengeTracking();
  msg.reply("Okay, Tracking Stopped!");
  msg.channel.send(EMOTES.Pika_Wink);
}

async function stop(msg) {
  await msg.reply("Stopped!");
  await logout();
  throw new Error("=> Bot was stopped manually.");
}
