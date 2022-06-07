import Game from "./Game.js";
import UI from "./UI.js";

var socket = io("ws://localhost:2137", {
	withCredentials: true,
	extraHeaders: {
		"cock": "nya"
	}
});

socket.emit("msg", "pogchamp");

socket.on("msg", (msg) => {
	console.log(msg);
});

window.onload = () => {
	window.game = new Game();
	window.ui = new UI();
};
