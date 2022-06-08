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
const io = new Server(httpServer, {
	cors: {
		origin: "http://127.0.0.1:2137",
		methods: ["GET", "POST"],
		// allowedHeaders: ["cock"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	socket.on("msg", (msg) => {
		console.log(socket.rooms);
		console.log(msg);
		socket.emit("msg", "gaming");
	});

	socket.on("disconnecting", () => {
		socket.leave();
		console.log(socket.rooms);
	});

	socket.on("login", async (user, room = "room1") => {
		socket.data.name = user;
		socket.join(room);

		const sockets = await io.in("room1").fetchSockets();
		const gaming = Array.from(sockets).map((el, i) => {
			return el.data.name;
		});
		//console.log("to coś", sockets);
		io.to("room1").emit("usersList", gaming);
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
