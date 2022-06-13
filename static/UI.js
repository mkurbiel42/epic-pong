import * as Net from "./Net.js";
import { createElement as c, editElement as e, removeElements as r } from "./libs/amog.js";

export default class UI {
	constructor() {
		this.username = "";

		this.root = document.getElementById("root");

		this.uiBox = c(
			"div",
			{ id: "uiBox" },
			(this.flexBreak = c("div", { className: "flexBreak" })),
			(this.loginBox = c(
				"div",
				{ className: "box", id: "loginBox" },

				(this.usernameInput = c("input", {
					placeholder: "Enter nickname",
					id: "usernameInput",
					maxLength: 10,
				})),
				(this.loginButton = c("button", {}, "LOGIN"))
			)),
			(this.activeUsersBox = c(
				"div",
				{ className: "box m-sm", id: "activeUsersBox" },
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
		var bonk = users.sort().map((user) => {
			if (user === Net.ඞ.data?.username) {
				return c("div", { className: "userOnTheList username" }, user);
			} else {
				return c("div", { className: "userOnTheList" }, user);
			}
		});
		console.log(bonk);
		if (bonk.length == 0) bonk.push("________");

		e(this.activeUsersBox, "Active users:", c("div", { id: "usersList" }, ...bonk));
	};

	viewMainMenu = () => {
		r(this.loginBox);
		e(
			this.uiBox,
			this.flexBreak,
			(this.mainMenuBox = c(
				"div",
				{ id: "mainMenu", className: "box horizontal" },
				(this.roomsMenu = c(
					"div",
					{ id: "roomsMenu", className: "box m-sm" },
					c(
						"p",
						{ id: "usernameLabel" },
						`Username:`,
						c("span", { className: "username" }, ` ${Net.ඞ.data.username}`)
					),

					c(
						"div",
						{ className: "section" },
						(this.roomLabel = c("p", { className: "label-sm pb-45" }, "Room name:")),
						(this.roomNameInput = c("input", {
							className: "txt-al-left",
							maxLength: 10,
						}))
					),
					c(
						"div",
						{ className: "section" },
						(this.epicnessSwitch = c("input", {
							type: "checkbox",
							onchange: () => {
								console.log(this.epicnessSwitch.checked);
							},
						}))
					),
					c(
						"div",
						{ className: "section" },
						(this.createRoomButton = c(
							"button",
							{
								className: "btn-secondary",
								onclick: () => {
									Net.joinRoom(
										this.roomNameInput.value,
										this.epicnessSwitch.checked // (tociej moment) ? true : false
									);
								},
							},
							"Join/Create"
						)),
						(this.joinRandomButton = c(
							"button",
							{
								onclick: () => {
									Net.joinRandom();
								},
							},
							"Join random"
						))
					)
				)),
				this.activeUsersBox
			))
		);
	};

	viewInGameUI = (roomname, username, id) => {
		r(this.mainMenuBox);
		e(
			this.uiBox,
			this.flexBreak,
			(this.inGameUI = c(
				"div",
				{ className: "box" },
				`room: ${roomname}, user:${username}, color:${id == -1 ? "red" : "blue"}`
			))
		);
	};

	destroyInGameUI = () => {
		r(this.inGameUI);
		this.clearBG();
	};
}
