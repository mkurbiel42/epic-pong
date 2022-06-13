export let ඞ;

export const init = () => {
	ඞ = io();
	let amogus = ඞ;
	ඞ.data = {};

	ඞ.emit("getUsersList");

	ඞ.on("msg", (msg) => {
		console.log(msg);
	});

	ඞ.on("error", (err) => {
		alert(err);
	});

	ඞ.on("usersList", (users) => {
		window.ui.updateUsers(users);
	});

	ඞ.on("userLoggedIn", (user) => {
		ඞ.data.username = user;
		window.ui.viewMainMenu();
	});

	ඞ.on("roomJoined", (roomName, id) => {
		ඞ.data.roomName = roomName;
		window.ui.viewInGameUI(roomName, ඞ.data.username, id);
		window.game.gamerId = id;

		//console.log(`welcomne to ${roomName}, you are ${id}`);
	});

	ඞ.on("startGame", (epicnessSwitch) => {
		console.log(epicnessSwitch);
		window.ui.destroyInGameUI();
		window.game.gameMode = epicnessSwitch ? "epic" : "very unpeic (not epic gaem )";
		window.game.initGame();
	});

	ඞ.on("paletkaMoved", (id, newPos) => {
		window.game.movePaletka(id, newPos);
	});

	ඞ.on("ballMoved", (newPos, newRotation) => {
		if (window.game.ballObject) {
			window.game.ballMove(newPos, newRotation);
		}
	});

	ඞ.on("angleChanged", (newAngle) => {
		window.game.changeAngle(newAngle);
	});

	ඞ.on("randomAngle", (angle, index) => {
		console.log("index", index);
		window.game.changeAngle(angle);
		window.game.getRandomAngle(angle, index);
	});

	ඞ.on("gameStart", () => {
		window.game.startGame();
	});

	ඞ.on("currentMoveChange", (value) => {
		window.game.changeCurrentMove(value);
	});

	ඞ.on("speedChange", (speed) => {
		window.game.changeSpeed(speed);
	});

	ඞ.on("isFirstMoveChange", (value) => {
		window.game.isFirstMove = value;
	});

	ඞ.on("allowPlankMovement", (value) => {
		window.game.allowPlankMovement = value;
	});

	ඞ.on("plankWidth", (value) => {
		window.game.editOpponentsPlankWidth(value);
	});

	ඞ.on("moveCounter", (value) => {
		window.game.moveCounter = value;
	});

	ඞ.on("victory royale", (message) => {
		victory(message);
	});

	ඞ.on("loss", (message) => {
		loss(message);
	});

	ඞ.on("pointScored", (forPlayer) => {
		if (forPlayer == 1) {
			window.game.blueScore += 1;
		} else {
			window.game.redScore += 1;
		}
		if (window.game.blueScore == 3) {
			if (window.game.gamerId == 1) {
				victory("w so big i can see it with no glasses");
			} else {
				loss("you lost L bozo");
			} //iom blu dadabibdadbabiadi dabadidabaai DABadbdbiadbiaD!
		} else if (window.game.redScore === 3) {
			if (window.game.gamerId == 1) {
				loss("you lost L bozo");
			} else {
				victory("w so big i can see it with no glasses");
			}
		}
		window.ui.updateScores(window.game.blueScore, window.game.redScore);
	});
};

let victory = (message) => {
	alert(`You won! ${message}!`);
	window.ui.blackOutBG();
	window.ui.viewMainMenu();
	ඞ.emit("joinLobby");
	window.game.destroyGame();
};
let loss = (message) => {
	alert(`You lost. ${message}.`);
	window.ui.blackOutBG();
	window.ui.viewMainMenu();
	ඞ.emit("joinLobby");
	window.game.destroyGame();
};
export const loginUser = (username) => {
	ඞ.emit("login", username);
};

export const joinRoom = (roomName, epicnessSwitch) => {
	// console.log(roomName);
	ඞ.emit("joinRoom", roomName, epicnessSwitch);
};

export const joinRandom = () => {
	ඞ.emit("joinRandom");
};

export const paletkaMove = (newPos) => {
	ඞ.emit("paletka", ඞ.data.roomName, window.game.gamerId, newPos);
};

export const syncBall = (newPos, newRotation) => {
	ඞ.emit("ball", newPos, newRotation);
};

export const syncAngle = (newAngle) => {
	ඞ.emit("angle", ඞ.data.roomName, newAngle);
	console.log(newAngle);
};

export const syncGameStart = () => {
	ඞ.emit("gameStart");
};

export const syncCurrentMove = (value) => {
	ඞ.emit("currentMove", value);
};

export const syncSpeed = (speed) => {
	ඞ.emit("speed", speed);
};

export const createRandomAngle = () => {
	ඞ.emit("randomAngle");
};

export const syncIsFirstMove = () => {
	ඞ.emit("isFirstMove", window.game.isFirstMove);
};

export const allowOpponentsPlankMovement = (value) => {
	ඞ.emit("allowOpponentsPlankMovement", value);
};

export const editPlankWidth = (value) => {
	ඞ.emit("editPlankWidth", value);
};

export const updateMoveCounter = (value) => {
	ඞ.emit("moveCounter", value);
};

// export const doDefault = () => {
// 	ඞ.emit("msg", "pogchamp");
// 	ඞ.emit("get room users");
// 	ඞ.on("msg", (msg) => {
// 		console.log(msg);
// 	});
// };
