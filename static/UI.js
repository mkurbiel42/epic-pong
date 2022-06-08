import * as Net from "./Net.js";
import { createElement as c, editElement as e } from "./libs/amog.js";

export default class UI {
	constructor() {
		this.activeUsersTimer = null;

		this.root = document.getElementById("root");

		this.uiBox = c(
			"div",
			{ id: "uiBox" },
			(this.loginBox = c(
				"div",
				{ id: "loginBox" },
				(this.usernameInput = c("input", { placeholder: "Enter nickname", id: "usernameInput" })),
				(this.loginButton = c("button", {}, "LOGIN"))
			))
		);
		this.root.appendChild(this.uiBox);

		this.activeUsersBox = c("div", { id: "activeUsersBox" }, "Logged in users");

		this.bindListeners();
		this.showLoginBox();
		this.showActiveUsers();
		this.blackOutBG();
	}

	bindListeners = () => {
		this.loginButton.addEventListener("click", () => {
			Net.loginUser(this.usernameInput.value);
		});
	};

	showLoginBox = () => {
		this.uiBox.appendChild(this.loginBox);
	};

	showActiveUsers = () => {
		this.uiBox.appendChild(this.activeUsersBox);
	};

	blackOutBG = () => {
		this.uiBox.classList.add("blackedOut");
	};

	clearBG = () => {
		this.uiBox.classList.remove("blackedOut");
	};

	updateUsers = (users) => {
		var bonk = users.map((user) => {
			return c("div", { className: "userOnTheList" }, user);
		});
		console.log(bonk);
		e(this.activeUsersBox, "Logged in users", c("div", { id: "usersOnTheList" }, ...bonk));
	};
}
