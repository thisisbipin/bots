import dotenv from "dotenv";
import { exec } from "child_process";
export function set_webHook_reciever(app) {
	dotenv.config();
	app.get("/" + process.env.WEBHOOK_URL, (req, res) => {
		res.send("Working..");
	});
	app.post("/" + process.env.WEBHOOK_URL, (req, res) => {
		console.log("trying to perform post");
		console.log(req.body);
		exec("git pull origin master && refresh", (error, stdout, stderr) => {
			console.log(`=> GIT status: ${stdout}`);
		});
		res.send("OK");
	});

	console.log("=> webhook Reciever was set");
}
