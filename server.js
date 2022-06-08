var express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
let cors = require("cors");
var app = express();
const PORT = 2137;
var path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static("static")); // serwuje stronę index.html

// const Datastore = require("nedb");

// const dataCache = new Datastore({
// 	filename: "dataCache.db",
// 	autoload: true
// });

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
	socket.emit("message", "It's working, i think.");

	socket.on("msg", (msg) => {
		console.log(msg);
		socket.emit("msg", "gaming");
	});
});

app.post("/reset", (req, res) => {
	loggedUsers = [];
	res.send(
		JSON.stringify({ status: "RESET_VALID", status_message: "Zresetowano listę użytkowników" })
	);
});

httpServer.listen(PORT, function () {
	console.log("start serwera na porcie " + PORT);
});
