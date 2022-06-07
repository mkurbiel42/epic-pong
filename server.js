var express = require("express");
const { json } = require("express/lib/response");
var app = express();
const PORT = 3000;
var path = require("path");

app.use(express.json());
app.use(express.static("static")); // serwuje stronę index.html

let loggedUsers = [];

app.post("/loginToServer", (req, res) => {
	let newUsername = req.body.nickname;

	if (newUsername == "") {
		res.send({
			status: "LOGIN_INVALID",
			status_message: "Nazwa użytkownika nie może być pusta"
		});
		return;
	}

	if (loggedUsers.includes(newUsername)) {
		res.send({
			status: "LOGIN_INVALID",
			status_message: "Podana nazwa użytkownika jest już zajęta"
		});
		return;
	}

	loggedUsers.push(newUsername);

	res.send(
		JSON.stringify({
			status: "LOGIN_VALID",
			status_message: `Użytkownik ${newUsername} pomyślnie zalogowany do serwera.`
		})
	);
});

app.post("/reset", (req, res) => {
	loggedUsers = [];
	res.send(
		JSON.stringify({ status: "RESET_VALID", status_message: "Zresetowano listę użytkowników" })
	);
});

app.listen(PORT, function () {
	console.log("start serwera na porcie " + PORT);
});
