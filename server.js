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

const Datastore = require("nedb");

const dataCache = new Datastore({
	filename: "dataCache.db",
	autoload: true,
});

dataCache.remove({ dataType: "player" });

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		//origin: "http://127.0.0.1:2137",
		methods: ["GET", "POST"],
		// allowedHeaders: ["cock"],
		//credentials: true
	},
});

const getUsersList = (callback, room = "lobby") => {
	dataCache.find({ dataType: "player" }, (err, res) => {
		callback(res);
	});
};

io.on("connection", (socket) => {
	socket.on("msg", (msg) => {
		// console.log(socket.rooms);
		console.log(msg);
		socket.emit("msg", "gaming");
	});

	socket.on("disconnecting", () => {
		console.log(socket.data.name);
		if (socket.data.name) {
			dataCache.remove({ dataType: "player", userName: socket.data.name }, () => {
				getUsersList((data) => {
					io.to("lobby").emit(
						"usersList",
						data.map((elem) => elem.userName),
						data
					);
				});
			});
		}
		socket.leave("lobby");
	});

	socket.on("login", async (user, room = "lobby") => {
		socket.data.name = user;
		socket.join(room);
		dataCache.insert({ dataType: "player", userName: user }, (err, newDoc) => {
			getUsersList((data) => {
				io.to(room).emit(
					"usersList",
					data.map((elem) => elem.userName),
					data
				);
			});
		});
	});

	socket.on("getUsersList", (...sus) => {
		getUsersList((data) => {
			socket.emit(
				"usersList",
				data.map((elem) => elem.userName)
			);
		}, "lobby");
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
