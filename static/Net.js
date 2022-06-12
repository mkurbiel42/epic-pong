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
};

export const loginUser = (username) => {
	ඞ.emit("login", username);
};

export const joinRoom = (roomName, epicnessSwitch) => {
	console.log(roomName);
	ඞ.emit("joinRoom", roomName, epicnessSwitch);
};

export const joinRandom = () => {
	ඞ.emit("joinRandom");
};

// export const doDefault = () => {
// 	ඞ.emit("msg", "pogchamp");
// 	ඞ.emit("get room users");
// 	ඞ.on("msg", (msg) => {
// 		console.log(msg);
// 	});
// };
