require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", () => {
  console.log("Our bot is ready to go");
});

client.on("message", (msg) => {
  if (msg.content === "hey") {
    msg.reply("I am working!");
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
