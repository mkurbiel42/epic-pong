export let ඞ;

export const init = () => {
	ඞ = io();
	ඞ.data = {};

	ඞ.emit("getUsersList");

	ඞ.on("msg", (msg) => {
		console.log(msg);
	});

	ඞ.on("error", (err) => {
		console.log(err);
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

	ඞ.on("ballMoved", (newPos) => {
		if (window.game.ballObject) window.game.ballMove(newPos);
	});

	ඞ.on("angleChanged", (newAngle) => {
		window.game.changeAngle(newAngle);
	});
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

export const syncBall = (newPos) => {
	ඞ.emit("ball", ඞ.data.roomName, newPos);
};

export const syncAngle = (newAngle) => {
	ඞ.emit("angle", ඞ.data.roomName, newAngle);
};

// export const doDefault = () => {
// 	ඞ.emit("msg", "pogchamp");
// 	ඞ.emit("get room users");
// 	ඞ.on("msg", (msg) => {
// 		console.log(msg);
// 	});
// };
