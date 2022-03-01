import express from "express";
var app = express();
import bodyParser from "body-parser";
import axios from "axios";
import { DISCORD_BOT } from "./bots/discord.js";
import { TELEGRAM__BOT } from "./bots/telegram.js";
app.use(express.static("public"));
app.use(bodyParser.json());
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(5000, async () => {
  console.log("Running at port", 5000);
});

// bot starts
DISCORD_BOT(app);
TELEGRAM__BOT(app, axios);
