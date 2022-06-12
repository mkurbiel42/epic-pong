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
	autoload: true
});

dataCache.remove({ dataType: "player" });

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		//origin: "http://127.0.0.1:2137",
		methods: ["GET", "POST"]
		// allowedHeaders: ["cock"],
		//credentials: true
	}
});

const getUsersList = (callback) => {
	dataCache.find({ dataType: "player" }, (err, res) => {
		callback(res);
	});
};

io.on("connection", (socket) => {
	socket.join("_lobby");

	socket.on("msg", (msg) => {
		console.log(msg);
		socket.emit("msg", "gaming");
	});

	socket.on("getUsersList", () => {
		getUsersList((data) => {
			socket.emit(
				"usersList",
				data.map((elem) => elem.userName)
			);
		}, "_lobby");
	});

	socket.on("login", async (user, room = "_lobby") => {
		if (user === "") {
			socket.emit("error", "Nazwa użytkownika nie może być pusta.");
			return;
		}

		if (user.substring(0, 1) === "_") {
			socket.emit("error", "Nazwa użytkownika nie może zaczynać się od '_'.");
			return;
		}

		if (user.length > 10) {
			socket.emit("error", "Nazwa użytkownika jest zbyt długa");
			return;
		}

		dataCache.findOne({ dataType: "player", userName: user }, (err, doc) => {
			if (!doc) {
				socket.data.name = user;
				socket.join(room);
				socket.emit("userLoggedIn", user);
				dataCache.insert(
					{ dataType: "player", userName: user, roomName: room },
					(err, newDoc) => {
						getUsersList((data) => {
							io.to(room).emit(
								"usersList",
								data.map((elem) => elem.userName)
							);
						});
					}
				);
			} else {
				socket.emit("error", "Podana nazwa jest obecnie zajęta.");
			}
		});
	});

	socket.on("disconnecting", () => {
		if (socket.data.name) {
			dataCache.remove({ dataType: "player", userName: socket.data.name }, () => {
				getUsersList((data) => {
					io.to("_lobby").emit(
						"usersList",
						data.map((elem) => elem.userName)
					);
				});
			});
		}
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
