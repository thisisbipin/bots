import dotenv from "dotenv";
export function TELEGRAM__BOT(app, url, axios) {
  dotenv.config();
  const { TELEGRAM_BOT_TOKEN, SERVER_URL } = process.env;
  const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
  const URI = url + `webhook/`;
  const WEBHOOK_URL = SERVER_URL + URI;
  console.log(WEBHOOK_URL);
  const init = async () => {
    const res = await axios.get(
      `${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`
    );
    console.log("=> Telegram : ", res.data);
    console.log("=> Our Telegram bot is ready to go..");
  };
  app.get("/telegram", (req, res) => {
    res.send("Telegram is running...");
  });
  app.get(URI, (req, res) => {
    res.send("Telegram Webhook is running...");
  });
  app.post(URI, async (req, res) => {
    // console.log(req.body);
    console.log(`=> Telegram : POST message --> ${req.body.message.text}`);
    const chatId = req.body.message.chat.id;
    let text = req.body.message.text;
    if (text == "hi") text = "Hi Akansha padhai karle thoda";
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
    res.send();
  });
  init();
}
