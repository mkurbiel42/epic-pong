let ඞ = null;

export const init = () => {
	console.log("Działa");
	ඞ = io("ws://localhost:2137", {
		//withCredentials: true,
	});

	ඞ.on("usersList", (users) => {
		console.log(users);
		window.ui.updateUsers(users);
	});

	ඞ.emit("getUsersList");
};

export const loginUser = (username, room = "room1") => {
	ඞ.emit("login", username, room);
};

// export const doDefault = () => {
// 	ඞ.emit("msg", "pogchamp");
// 	ඞ.emit("get room users");
// 	ඞ.on("msg", (msg) => {
// 		console.log(msg);
// 	});
// };
