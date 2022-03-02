import dotenv from "dotenv";
import Discord from "discord.js";
export function DISCORD_BOT(app, url) {
  dotenv.config();
  const display_message = "Discord Not running...";
  const client = new Discord.Client();
  app.get(url, (req, res) => {
    res.send(display_message);
  });

  client.on("ready", () => {
    console.log("=> Our Discord bot is ready to go..");
  });

  client.on("message", (msg) => {
    if (msg.content === "hey") {
      msg.reply("I am working!");
    }
    if (msg.content === "!stop") {
      stopBot(msg);
    }
  });

  async function stopBot(msg) {
    await msg.reply("Stopped!");
    throw new Error("Bot stopped manually!!");
  }

  client.login(process.env.DISCORD_BOT_TOKEN);
  //   1646105400000 + 86400000;
}
