const ඞ = io("ws://localhost:2137", {
	withCredentials: true,
});

export const loginUser = (username, room = "room1") => {
	ඞ.emit("login", username, room);
};

export const doDefault = () => {
	ඞ.emit("msg", "pogchamp");
	ඞ.emit("get room users");
	ඞ.on("msg", (msg) => {
		console.log(msg);
	});
};

ඞ.on("usersList", (users) => {
	console.log(users);
	window.ui.updateUsers(users);
});
