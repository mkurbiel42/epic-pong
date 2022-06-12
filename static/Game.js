import Ball from "./Ball.js";
import Boundary from "./Boundary.js";
import Floor from "./Floor.js";
import Plank from "./Plank.js";
import Line from "./Line.js";
import { FLAT_SURFACES_THICKNESS, SAFEAREA_MULTIPLIER } from "./Consts.js";
import { ඞ } from "./Net.js";

export default class Game {
	constructor() {
		// domyślne zmienne
		this.FIELD_SIZE = { x: 1125, z: 1800 }; //rozmiar pola gry

		this.gameMode = "classic";
		this.isFirstMove = true;
		this.firstMove = 0;
		// this.firstlyMoving = 0; //💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀

		this.paletkiSize = [
			this.FIELD_SIZE.z / 3.14159,
			this.FIELD_SIZE.z / 4.2,
			this.FIELD_SIZE.z / 6.9,
			this.FIELD_SIZE.z / 7.312,
			this.FIELD_SIZE.z / 9.11,
			this.FIELD_SIZE.z / 13.37
		];
		// this.paletkiSize = [
		// 	this.FIELD_SIZE.z / 12.5,
		// 	this.FIELD_SIZE.z / 2.5,
		// 	this.FIELD_SIZE.z / 3,
		// 	this.FIELD_SIZE.z / 3.5,
		// 	this.FIELD_SIZE.z / 9.11,
		// 	this.FIELD_SIZE.z / 13.37
		// ];
		this.maxMoves = this.paletkiSize.length - 1;

		this.aspect = window.innerWidth / window.innerHeight;
		// definicje sceny i kamery
		this.scene = new THREE.Scene();
		this.camera3d = new THREE.PerspectiveCamera(90, this.aspect, 0.1, 10000);

		//this.camera2d = new THREE.OrthographicCamera(-1920, 1920, 1080, -1080, 1, 10000);
		this.camera2d = new THREE.OrthographicCamera(
			(this.FIELD_SIZE.x * -1 - 200) * this.aspect,
			(this.FIELD_SIZE.x * 1 + 200) * this.aspect,
			this.FIELD_SIZE.x * 1 + 200,
			this.FIELD_SIZE.x * -1 - 200,
			1,
			10000
		);

		this.cam3dMode();

		this.resetCamera(false, "3d");

		// dodanie pomocniczych osi (usunąć później!)
		// this.axes = new THREE.AxesHelper(1000);
		// this.scene.add(this.axes);

		// renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0x143891);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById("root").appendChild(this.renderer.domElement);

		this.gameStarted = false;
		this.gameStopped = false;
		this.allowPlankMovement = true;
		this.angle = 0;
		// init który w sumie jest niepotrzebny ale co z tego
		this.init();
	}

	init = () => {
		// bind do zmiany rozmiaru okna (skalowanie renderera i kamery)
		window.onresize = () => {
			this.windowResize();
		};

		this.addLights();
		this.addFloor();
		this.addBoundaries();
		this.addLines();
		this.render();

		// this.initGame();
	};

	initGame = () => {
		this.addBall();
		this.addPlanks();
		this.startGame();
	};

	startGame = () => {
		this.moveCounter = 0;
		this.startingPlayer = 0;
		let animationTime = 1000;
		let delayTime = 1200;

		new TWEEN.Tween(this.ballObject.position)
			.to(this.ballObject.defaultPos, animationTime)
			.easing(TWEEN.Easing.Bounce.Out)
			.delay(delayTime)
			.start();

		this.setPlanksToDefaultPoses();
		setTimeout(() => {
			// domyślny kąt toczenia się piłki i prędkość
			this.getRandomAngle();
			this.defaultSpeed = 17.5;
			this.speed = this.defaultSpeed;
			this.plankSpeed = 12;
			this.gameStarted = true;
			this.gameStopped = false;
		}, animationTime + delayTime);
	};

	resetCamera = (withAnimaton = false, mode = "3d") => {
		let cameraPos = !this.isFirstMove ? { x: 0, y: 1800, z: 0 } : { x: 0, y: 400, z: 2400 };
		let delay = !this.isFirstMove ? 1300 : 0;
		let rotation = !this.isFirstMove ? Math.PI / 2 : 0;
		let camPos = this.camera.position;

		if (mode == "3d") {
			this.cam3dMode();
			this.camera.position.set(camPos.x, camPos.y, camPos.z);
			this.camera.lookAt(this.scene.position);
		} else {
			this.cam2dMode();
			this.camera.position.set(0, 1800, 0);
			this.camera.lookAt(this.scene.position);
			this.camera.rotation.z = Math.PI / 2;
		}

		if (withAnimaton) {
			//ustawienie kamery dla gracza 1
			if (this.camera === this.camera3d) {
				new TWEEN.Tween(this.camera.position)
					.to(cameraPos, 800)
					.delay(delay)
					.easing(TWEEN.Easing.Linear.None)
					.start();
				setTimeout(() => {
					this.camera.lookAt(this.scene.position);
					this.camera.rotation.z = rotation;
					this.camera.updateProjectionMatrix();
				}, 1000 + delay);
			}
		} else {
			this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
			this.camera.lookAt(this.scene.position);
			this.camera.updateProjectionMatrix();
		}
	};

	getRandomAngle = () => {
		do {
			this.angle = Math.random() * 2 * Math.PI - Math.PI;
		} while (Math.abs(Math.PI / 2 - Math.abs(this.angle)) < Math.PI / 9);
		if (Math.abs(this.angle) > Math.PI / 2) {
			this.updateCurrentMove(-1, true);
			this.firstMove = -1;
		} else {
			this.updateCurrentMove(1, true);
			this.firstMove = 1;
		}

		// please don't svelte
		//		please don't svelte
		// 			please don't svelte
		// 				please don't svelte
		// 					please don't svelte
		// 						please don't svelte
		// 							please don't svelte
		// 									please don't svelte
		// 										please don't svelte
		// 											please don't svelte

		this.allowPlankMovement = true;
	};

	updateCurrentMove = (value, dont = false) => {
		if (this.gameMode === "epic") {
			if (this.currentMove == this.firstMove && !dont) {
				this.moveCounter += 1;
				console.log(this.moveCounter);
			}

			this.currentlyMovingPlank.editWidth(
				this.moveCounter <= this.maxMoves
					? this.paletkiSize[this.moveCounter]
					: this.paletkiSize[this.maxMoves]
			);
		}
		this.currentMove = value;

		if (value == -1) {
			this.currentlyMovingPlank = this.plank2;
		} else if (value == 1) {
			this.currentlyMovingPlank = this.plank1;
		} else {
			this.currentlyMovingPlank = null;
		}

		if (this.gameMode !== "epic") {
			this.speed *= 1.05;
		}

		if (this.currentlyMovingPlank && this.gameStarted && this.gameMode === "epic") {
			if (this.isFirstMove) {
				this.isFirstMove = false;
				this.resetCamera(true, "2d");
			}
			let ballStoppingTime = 1600;
			new TWEEN.Tween(this)
				.to({ speed: 0 }, ballStoppingTime)
				.easing(TWEEN.Easing.Cubic.Out)
				.start();

			setTimeout(() => {
				this.gameStarted = false;
				this.allowPlankMovement = true;
				setTimeout(() => {
					this.speed = this.defaultSpeed;
					this.allowPlankMovement = false;
					this.gameStarted = true;
				}, 5000);
			}, ballStoppingTime);
		}

		this.plank1.movingLeft = false;
		this.plank1.movingRight = false;
		this.plank2.movingLeft = false;
		this.plank2.movingRight = false;
	};

	addBall = () => {
		// utworzenie piłki
		this.isFirstMove = true;
		this.ballObject = new Ball();
		this.ballObject.position.set(0, 400, 0);
		this.scene.add(this.ballObject);
	};

	addLights = () => {
		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
		this.scene.add(this.ambientLight);

		this.dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
		this.dirLight.position.set(500, 400, 200);
		this.scene.add(this.dirLight);
	};

	addFloor = () => {
		this.floor = new Floor(this.FIELD_SIZE.x * 2, this.FIELD_SIZE.z * 2 * SAFEAREA_MULTIPLIER);
		this.scene.add(this.floor);
	};

	addBoundaries = () => {
		let poses = [
			{ x: this.FIELD_SIZE.x, y: 15, z: 0, rotation: Math.PI / 2 },
			{ x: -this.FIELD_SIZE.x, y: 15, z: 0, rotation: Math.PI / 2 }
		];
		poses.forEach((pose) => {
			let boundary = new Boundary(
				this.FIELD_SIZE.z * 2 * SAFEAREA_MULTIPLIER,
				pose.x,
				pose.z,
				pose.rotation
			);
			this.scene.add(boundary);
		});
	};

	addPlanks = () => {
		this.defaultPaletkaWidth =
			this.gameMode === "epic" ? this.paletkiSize[0] : this.paletkiSize[this.maxMoves - 1];

		this.plank1 = new Plank(this.defaultPaletkaWidth, this.FIELD_SIZE.z);
		this.plank1.name = "plank1";
		this.scene.add(this.plank1);

		this.plank2 = new Plank(this.defaultPaletkaWidth, -this.FIELD_SIZE.z);
		this.plank2.name = "plank2";
		this.scene.add(this.plank2);

		this.currentlyMovingPlank = this.plank1;

		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "a":
					this.currentlyMovingPlank.movingRight = false;
					this.currentlyMovingPlank.movingLeft = true;
					break;
				case "d":
					this.currentlyMovingPlank.movingLeft = false;
					this.currentlyMovingPlank.movingRight = true;
					break;
			}
		});

		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
					this.currentlyMovingPlank.movingLeft = false;
					break;
				case "d":
					this.currentlyMovingPlank.movingRight = false;
					break;
			}
		});
	};

	setPlanksToDefaultPoses = () => {
		let time = 1300;
		this.allowPlankMovement = false;
		setTimeout(() => {
			this.allowPlankMovement = true;
		}, time);
		new TWEEN.Tween(this.plank1.position)
			.to(this.plank1.defaultPos, time)
			.easing(TWEEN.Easing.Bounce.Out)
			.start();
		new TWEEN.Tween(this.plank2.position)
			.to(this.plank2.defaultPos, time)
			.easing(TWEEN.Easing.Bounce.Out)
			.start();
	};

	addLines = () => {
		this.linesObject = new THREE.Object3D();
		this.linesObject.add(new Line(this.FIELD_SIZE.x * 2, 0, 0));
		this.linesObject.add(new Line(this.FIELD_SIZE.x * 2, 0, this.FIELD_SIZE.z));
		this.linesObject.add(new Line(this.FIELD_SIZE.x * 2, 0, -this.FIELD_SIZE.z));

		this.scene.add(this.linesObject);
	};

	moveBall = () => {
		// porusz piłkę o podany wektor prędkości
		this.ballObject.position.x += Math.sin(this.angle) * this.speed /** 3*/;
		this.ballObject.position.z += Math.cos(this.angle) * this.speed;

		// this.camera.position.x += Math.sin(this.angle) * this.speed /** 3*/;
		// this.camera.position.z += Math.cos(this.angle) * this.speed;
		// this.camera.lookAt(this.ballObject.position);
		// this.camera.updateProjectionMatrix();

		// obróć piłkę wokół własnej osi
		this.ballObject.ball.rotation.x +=
			this.speed * (this.speed / (this.ballObject.size * Math.PI));

		if (
			//sprawdź czy piłka nie odbija się od ściany
			Math.abs(this.ballObject.position.x) >= this.FIELD_SIZE.x - this.ballObject.size &&
			//sprawdź czy piłka nie spada po punkcie
			this.ballObject.position.y > 0
		) {
			this.angle *= -1;
			this.ballObject.rotation.y = this.angle;
		}

		if (
			Math.abs(this.ballObject.position.z) >=
			this.FIELD_SIZE.z - this.ballObject.size - FLAT_SURFACES_THICKNESS / 2
		) {
			//sprawdzenie czy cała piłka przekracza linię deski
			if (
				//hitbox dla pierwszej deski
				(this.ballObject.position.x >=
					this.plank1.position.x - this.plank1.width / 2 - this.ballObject.size &&
					this.ballObject.position.x <=
						this.plank1.position.x + this.plank1.width / 2 + this.ballObject.size &&
					Math.abs(
						this.ballObject.position.z + this.ballObject.size - this.FIELD_SIZE.z
					) <= this.ballObject.size) ||
				//hitbox dla drugiej deski
				(this.ballObject.position.x >=
					this.plank2.position.x - this.plank2.width / 2 - this.ballObject.size &&
					this.ballObject.position.x <=
						this.plank2.position.x + this.plank2.width / 2 + this.ballObject.size &&
					Math.abs(
						this.ballObject.position.z + this.ballObject.size + this.FIELD_SIZE.z
					) <= this.ballObject.size)
			) {
				//odbicie piłki od deski
				if (this.ballObject.position.z > 0 && this.currentMove == 1) {
					this.angle =
						Math.PI -
						this.angle -
						(3 / 2) *
							Math.asin(
								(this.ballObject.position.x - this.plank1.position.x) /
									(this.plank1.width + this.ballObject.size * 2)
							);
					this.updateCurrentMove(-1);
				} else if (this.ballObject.position.z < 0 && this.currentMove == -1) {
					console.log();
					this.angle =
						Math.PI -
						this.angle +
						(3 / 2) *
							Math.asin(
								(this.ballObject.position.x - this.plank2.position.x) /
									(this.plank2.width + this.ballObject.size * 2)
							);
					this.updateCurrentMove(1);
				}
			} else {
				if (
					Math.abs(this.ballObject.position.z) >
					this.FIELD_SIZE.z * SAFEAREA_MULTIPLIER
				) {
					this.ballObject.position.y -= this.speed / 2;
					if (!this.gameStopped) {
						console.log("Punkt!");
						this.gameStopped = true;
						setTimeout(() => {
							this.isFirstMove = true;
							setTimeout(() => {
								this.speed = this.defaultSpeed;
								this.plank1.editWidth(this.defaultPaletkaWidth);
								this.plank2.editWidth(this.defaultPaletkaWidth);
								this.ballObject.position.set(0, 400, 0);
								this.gameStopped = false;
								this.gameStarted = false;
								this.resetCamera(false, "3d");
								this.startGame();
							}, 550);
						}, 2000);
					}
				}
			}
		}
	};

	movePlankAccordingly = () => {
		if (!this.currentlyMovingPlank) return;
		if (!this.allowPlankMovement || this.gameStopped) return;

		let multiplier = this.currentMove;

		if (
			// sprawdź czy deska nie uderzyła w prawą ścianę
			multiplier * this.currentlyMovingPlank.position.x <
				this.FIELD_SIZE.x -
					this.currentlyMovingPlank.width / 2 -
					2 * FLAT_SURFACES_THICKNESS -
					12 &&
			this.currentlyMovingPlank.movingRight
		) {
			this.currentlyMovingPlank.position.x += this.plankSpeed * 1.25 * multiplier;
			// this.camera.position.x += this.plankSpeed * multiplier;
			// this.camera.updateProjectionMatrix();
		}

		if (
			//sprawdź czy deska nie uderzyła w lewą ścianę
			multiplier * this.currentlyMovingPlank.position.x >
				-this.FIELD_SIZE.x +
					this.currentlyMovingPlank.width / 2 +
					2 * FLAT_SURFACES_THICKNESS +
					12 &&
			this.currentlyMovingPlank.movingLeft
		) {
			this.currentlyMovingPlank.position.x -= this.plankSpeed * 1.25 * multiplier;
			// this.camera.position.x -= this.plankSpeed * multiplier;
			// this.camera.updateProjectionMatrix();
		}
	};

	cam3dMode = () => {
		this.camera = this.camera3d;
	};

	cam2dMode = () => {
		this.camera = this.camera2d;
	};

	windowResize = () => {
		this.aspect = window.innerWidth / window.innerHeight;
		if (this.camera === this.camera3d) {
			this.camera.aspect = this.aspect;
		} else {
			this.camera.left = (this.FIELD_SIZE.x * -1 - 200) * this.aspect;
			this.camera.right = (this.FIELD_SIZE.x * 1 + 200) * this.aspect;
			this.camera.top = this.FIELD_SIZE.x * 1 + 200;
			this.camera.bottom = this.FIELD_SIZE.x * -1 - 200;
		}
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	render = () => {
		//console.log(new Date());
		this.movePlankAccordingly();
		if (this.gameStarted) {
			this.moveBall();
		}
		TWEEN.update();
		requestAnimationFrame(this.render);
		this.renderer.render(this.scene, this.camera);
	};
}
