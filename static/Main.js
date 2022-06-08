import Game from "./Game.js";
import UI from "./UI.js";
import * as Net from "./Net.js";

window.onload = () => {
	window.game = new Game();
	window.ui = new UI();
	Net.doDefault();
};
