import * as Net from "./Net.js";

export default class UI {
	constructor() {
		this.activeUsersTimer = null;

		this.root = document.getElementById("root");

		this.uiBox = document.createElement("div");
		this.uiBox.id = "uiBox";
		this.root.appendChild(this.uiBox);

		this.loginBox = document.createElement("div");
		this.loginBox.id = "loginBox";

		this.usernameInput = document.createElement("input");
		this.usernameInput.placeholder = "Wpisz swój nick";
		this.loginButton = document.createElement("button");
		this.resetButton = document.createElement("button");

		this.loginButton.innerText = "LOGUJ";
		this.resetButton.innerText = "RESET";

		this.loginBox.innerText = "LOGOWANIE";
		this.loginBox.appendChild(this.usernameInput);
		this.loginBox.appendChild(this.loginButton);
		this.loginBox.appendChild(this.resetButton);

		this.activeUsersBox = document.createElement("div");
		this.activeUsersBox.id = "activeUsersBox";
		this.activeUsersBox.innerText = "Zalogowani użytkownicy";

		this.bindListeners();
		this.showLoginBox();
		this.showActiveUsers();
		this.blackOutBG();
	}

	bindListeners = () => {
		this.loginButton.addEventListener("click", () => {
			Net.loginToServer(this.usernameInput.value, (data) => {
				console.log(data);
			});
		});

		this.resetButton.addEventListener("click", () => {
			Net.reset();
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
}
