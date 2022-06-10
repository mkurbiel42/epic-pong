import * as Net from "./Net.js";
import { createElement as c, editElement as e, removeElements as r } from "./libs/amog.js";

export default class UI {
	constructor() {
		this.root = document.getElementById("root");
		this.asdasd = document.createElement("div");

		this.uiBox = c(
			"div",
			{ id: "uiBox" },
			(this.flexBreak = c("div", { className: "flexBreak" })),
			(this.loginBox = c(
				"div",
				{ className: "box", id: "loginBox" },

				(this.usernameInput = c("input", {
					placeholder: "Enter nickname",
					id: "usernameInput"
				})),
				(this.loginButton = c("button", {}, "LOGIN"))
			)),
			(this.activeUsersBox = c(
				"div",
				{ className: "box", id: "activeUsersBox" },
				"Logged in users"
			))
		);

		this.bindListeners();
		this.initUI();
		this.blackOutBG();
	}

	bindListeners = () => {
		this.loginButton.addEventListener("click", () => {
			Net.loginUser(this.usernameInput.value);
			r(this.loginBox);
		});
	};

	initUI = () => {
		this.root.appendChild(this.uiBox);
	};

	blackOutBG = () => {
		this.uiBox.classList.add("blackedOut");
	};

	clearBG = () => {
		this.uiBox.classList.remove("blackedOut");
	};

	updateUsers = (users) => {
		console.log(users);
		var bonk = users.map((user) => {
			return c("div", { className: "userOnTheList" }, user);
		});
		console.log(bonk);
		e(this.activeUsersBox, "Logged in users", c("div", { id: "usersOnTheList" }, ...bonk));
	};
}
