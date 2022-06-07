var express = require("express");
const { json } = require("express/lib/response");
const { Server } = require("socket.io");
const { createServer } = require("http");
let cors = require("cors");
var app = express();
const PORT = 2138;
var path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.static("static")); // serwuje stronę index.html

// const Datastore = require("nedb");

// const dataCache = new Datastore({
// 	filename: "dataCache.db",
// 	autoload: true
// });
const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:2138",
		methods: ["GET", "POST"],
		allowedHeaders: ["cock"],
		credentials: true
	}
});
httpServer.listen(2137);
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

app.listen(PORT, function () {
	console.log("start serwera na porcie " + PORT);
});
