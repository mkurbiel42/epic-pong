var express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
let cors = require("cors");
var app = express();
const PORT = 2137;
var path = require("path");

/////////////////
//             //
//  hehe 4/20  //
//	 		   //
/////////////////

// please don't svelte
//		please don't svelte
// 			please don't svelte
// 				please don't svelte
// 					please don't svelte
// 						please don't svelte
// 							please don't svelte
// 									please don't svelte
// 										please don't svelte
// 											please don't svelte

app.use(cors());
app.use(express.json());
app.use(express.static("static")); // serwuje stronę index.html jak tak to spoko

const Datastore = require("nedb");

const dataCache = new Datastore({
	filename: "dataCache.db",
	autoload: true
});

//svelte my beloved

dataCache.remove({}, { multi: true });
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
				socket.data.username = user;
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

	socket.on("joinRandom", async () => {
		dataCache.find({ dataType: "room" }, (err, docs) => {
			docs = docs.filter((doc) => doc.players == 1);
			if (docs.length > 0) {
				let currentRoom = docs[Math.floor(Math.random() * (docs.length - 1))];
				console.log(currentRoom);

				dataCache.update(
					{ dataType: "room", roomName: currentRoom.roomName },
					{ $set: { players: 2 } },
					{},
					(err) => {
						if (err) console.log(err);
					}
				);
				dataCache.update(
					{ dataType: "player", userName: socket.data.username },
					{ $set: { roomName: currentRoom.roomName } },
					{},
					(err) => {
						console.log("update poszedł");
						if (err) console.log(err);
					}
				);
			} else {
				let roomName = [...Array(10)].map(() => Math.random().toString(36)[2]).join("");
				let epicnessSwitch = Math.random() < 0.5;

				console.log(roomName, epicnessSwitch);
				dataCache.insert(
					{
						dataType: "room",
						roomName: roomName,
						epicnessSwitch: epicnessSwitch,
						players: 1
					},
					(err, newDoc) => {
						console.log(roomName);
						console.log(socket.data);
						dataCache.update(
							{ dataType: "player", userName: socket.data.username },
							{ $set: { roomName: roomName } },
							{},
							(err) => {
								console.log("update poszedł");
								if (err) console.log(err);
							}
						);
					}
				);
			}
		});
	});

	socket.on("joinRoom", async (roomName, epicnessSwitch) => {
		dataCache.findOne({ dataType: "room", roomName: roomName }, (err, doc) => {
			if (doc) {
				if (doc.players < 2) {
					//-5XD
					console.log("[object Object]");
					socket.join(roomName);
					dataCache.update(
						{ dataType: "room", roomName: roomName },
						{ $set: { players: 2 } },
						{},
						(err) => {
							if (err) console.log(err);
						}
					);
					dataCache.update(
						{ dataType: "player", userName: socket.data.username },
						{ $set: { roomName: roomName } },
						{},
						(err) => {
							console.log("update poszedł");
							if (err) console.log(err);
						}
					);
				} else {
					socket.emit("error", "Too many players, room is full");
				}
			} else {
				socket.join(roomName);

				socket.emit("roomCreated", roomName);
				dataCache.insert(
					{
						dataType: "room",
						roomName: roomName,
						epicnessSwitch: epicnessSwitch,
						players: 1
					},
					(err, newDoc) => {
						console.log(roomName);
						console.log(socket.data);
						dataCache.update(
							{ dataType: "player", userName: socket.data.username },
							{ $set: { roomName: roomName } },
							{},
							(err) => {
								console.log("update poszedł");
								if (err) console.log(err);
							}
						);
					}
				);
			}
		});
	});

	socket.on("disconnecting", () => {
		if (socket.data.username) {
			dataCache.remove({ dataType: "player", userName: socket.data.username }, () => {
				if (socket.rooms > 1) {
					let bruh = socket.rooms.filter((room) => {
						return room != "_lobby" && room != socket.id;
					});
					if (bruh.length > 0) {
						dataCache.findOne({ dataType: "room", roomName: bruh[0] }, (err, doc) => {
							console.log(doc);
							if (doc) {
								if (doc.players == 1) {
									dataCache.remove({ dataType: "room", roomName: doc.roomName });
								} else {
									io.to(doc.roomName).emit("victory royale", "user left"); //yeah fortnite we bout tiog ett down get down ten kills on the board right now just wiped out tomato town
									dataCache.remove({ dataType: "room", roomName: doc.roomName });
								}
							}
						});
					}
				}

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
