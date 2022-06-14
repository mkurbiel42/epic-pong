import Ball from "./Ball.js";
import Boundary from "./Boundary.js";
import Floor from "./Floor.js";
import Plank from "./Plank.js";
import Line from "./Line.js";
import { FLAT_SURFACES_THICKNESS, SAFEAREA_MULTIPLIER } from "./Consts.js";
import {
	ඞ,
	paletkaMove,
	syncBall,
	syncAngle,
	syncGameStart,
	syncCurrentMove,
	syncSpeed,
	createRandomAngle,
	syncIsFirstMove,
	allowOpponentsPlankMovement,
	editPlankWidth,
	updateMoveCounter
} from "./Net.js";

export default class Game {
	constructor() {
		this.gamerId = 0.65;
		// domyślne zmienne
		this.FIELD_SIZE = { x: 1125, z: 1800 }; //rozmiar pola gry

		this.blueScore = 0;
		this.redScore = 0;
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
		this.maxMoves = this.paletkiSize.length - 1;

		this.aspect = window.innerWidth / window.innerHeight;
		// definicje sceny i kamery
		this.scene = new THREE.Scene();
		this.camera3d = new THREE.PerspectiveCamera(90, this.aspect, 0.1, 10000);

		//this.camera2d = new THREE.OrthographicCamera(-1920, 1920, 1080, -1080, 1, 10000);
		this.camera2d = new THREE.OrthographicCamera(
			this.FIELD_SIZE.z * -1 - 200,
			this.FIELD_SIZE.z * 1 + 200,
			this.FIELD_SIZE.x * 1 + 200 / this.aspect,
			this.FIELD_SIZE.x * -1 - 200 / this.aspect,
			1,
			10000
		);

		this.cam3dMode();

		this.resetCamera("3d");

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

	initGame = (epic) => {
		this.blueScore = 0;
		this.redScore = 0;
		window.ui.updateScores(this.blueScore, this.redScore);
		this.addBall();
		this.addPlanks(epic);
		this.startGame();
		this.started = true;
	};

	destroyGame = () => {
		this.scene.remove(this.ballObject);
		this.scene.remove(this.plank1);
		this.scene.remove(this.plank2);
		setTimeout(() => {
			this.started = false;
		}, 1500);
	};

	startGame = () => {
		this.allowPlankMovement = false;
		this.moveCounter = 0;
		this.startingPlayer = 0;
		let animationTime = 1000;
		let delayTime = 1200;

		this.resetCamera();

		new TWEEN.Tween(this.ballObject.position)
			.to(this.ballObject.defaultPos, animationTime)
			.easing(TWEEN.Easing.Bounce.Out)
			.delay(delayTime)
			.start();

		this.setPlanksToDefaultPoses();
		setTimeout(() => {
			// domyślny kąt toczenia się piłki i prędkość
			if (this.gamerId === 1) createRandomAngle();
			this.defaultSpeed = 17.5;
			this.speed = this.defaultSpeed;
			this.plankSpeed = 12;
			this.gameStarted = true;
			this.gameStopped = false;
			if (this.gameMode == "epic") {
				this.isFirstMove = true;
				syncIsFirstMove();
			}
			setTimeout(() => {
				this.allowPlankMovement = true;
			}, 1000);
		}, animationTime + delayTime);
	};

	resetCamera = (mode = "3d") => {
		let cameraPos =
			mode == "2d" ? { x: 0, y: 1800, z: 0 } : { x: 0, y: 400, z: 2400 * this.gamerId };
		let delay = !this.isFirstMove ? 1300 : 0;
		let rotation = !this.isFirstMove ? Math.PI / 2 : 0;
		let camPos = this.camera.position;

		if (mode == "3d") {
			this.cam3dMode();
			this.camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
			this.camera.lookAt(this.scene.position);
		} else {
			this.cam2dMode();
			this.camera.position.set(0, 1800, 0);
			this.camera.lookAt(this.scene.position);
			this.camera.rotation.z = Math.PI / 2;
		}
	};

	getRandomAngle = (angle, index) => {
		// console.log(angle, index);
		this.updateCurrentMove(index, true);
		this.firstMove = index;
		if (this.firstMove != this.gamerId && this.gameMode == "epic") {
			this.resetCamera("2d");
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
				updateMoveCounter(this.moveCounter);
			}

			// console.log(this.moveCounter);
			this.currentlyMovingPlank.editWidth(
				this.moveCounter <= this.maxMoves
					? this.paletkiSize[this.moveCounter]
					: this.paletkiSize[this.maxMoves]
			);
			editPlankWidth(this.currentlyMovingPlank.width);

			this.allowPlankMovement = false;
			allowOpponentsPlankMovement(true);
		}
		this.currentMove = value;
		syncCurrentMove(value);

		// if (value == -1) {
		// 	this.currentlyMovingPlank = this.plank2;
		// } else if (value == 1) {
		// 	this.currentlyMovingPlank = this.plank1;
		// } else {
		// 	this.currentlyMovingPlank = null;
		// }

		if (this.gameMode !== "epic") {
			this.speed *= 1.05;
			syncSpeed(this.speed);
		}

		if (this.currentlyMovingPlank && this.gameStarted && this.gameMode === "epic" && !dont) {
			if (this.isFirstMove) {
				this.isFirstMove = false;
				syncIsFirstMove();
				this.resetCamera("2d");
			}
			let ballStoppingTime = 1600;
			new TWEEN.Tween(this)
				.to({ speed: 0 }, ballStoppingTime)
				.easing(TWEEN.Easing.Cubic.Out)
				.start();

			setTimeout(() => {
				this.gameStarted = false;
				allowOpponentsPlankMovement(true);
				setTimeout(() => {
					this.speed = this.defaultSpeed;
					this.allowPlankMovement = true;
					allowOpponentsPlankMovement(false);
					this.gameStarted = true;
				}, 5000);
			}, ballStoppingTime);
			this.plank1.movingLeft = false;
			this.plank1.movingRight = false;
			this.plank2.movingLeft = false;
			this.plank2.movingRight = false;
		}
	};

	addBall = () => {
		// utworzenie piłki
		this.isFirstMove = true;
		syncIsFirstMove();
		this.ballObject = new Ball();
		// ball ///da //todo: stok uli
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

	addPlanks = (epic) => {
		this.defaultPaletkaWidth = epic ? this.paletkiSize[0] : this.paletkiSize[this.maxMoves];

		this.plank1 = new Plank(this.defaultPaletkaWidth, this.FIELD_SIZE.z);
		this.plank1.name = "plank1";
		this.scene.add(this.plank1);

		this.plank2 = new Plank(this.defaultPaletkaWidth, -this.FIELD_SIZE.z);
		this.plank2.name = "plank2";
		this.scene.add(this.plank2);

		this.currentlyMovingPlank = this.gamerId == 1 ? this.plank1 : this.plank2;

		window.addEventListener("keydown", (e) => {
			if (this.allowPlankMovement) {
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
			}
		});

		window.addEventListener("keyup", (e) => {
			if (this.allowPlankMovement) {
				switch (e.key) {
					case "a":
						this.currentlyMovingPlank.movingLeft = false;
						break;
					case "d":
						this.currentlyMovingPlank.movingRight = false;
						break;
				}
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
		this.linesObject.add(new Line(this.FIELD_SIZE.x * 2, 0, 0, 0xefefef));
		this.linesObject.add(new Line(this.FIELD_SIZE.x * 2, 0, this.FIELD_SIZE.z, 0x0000ee));
		this.linesObject.add(new Line(this.FIELD_SIZE.x * 2, 0, -this.FIELD_SIZE.z, 0xee0000));

		this.scene.add(this.linesObject);
	};

	moveBall = () => {
		if (
			(this.gamerId == -1 && this.ballObject.position.z >= 200) ||
			(this.gamerId == 1 && this.ballObject.position.z < 200)
		) {
			return;
		}
		// console.log(this.gamerId, this.ballObject.position.z);
		// porusz piłkę o podany wektor prędkości
		this.ballObject.position.x += Math.sin(this.angle) * this.speed /** 3*/;
		this.ballObject.position.z += Math.cos(this.angle) * this.speed;

		// obróć piłkę wokół własnej osi
		this.ballObject.ball.rotation.x +=
			this.speed * (this.speed / (this.ballObject.size * Math.PI));

		if (
			//sprawdź czy piłka odbija się od ściany
			Math.abs(this.ballObject.position.x) >= this.FIELD_SIZE.x - this.ballObject.size &&
			//sprawdź czy piłka nie spada po punkcie
			this.ballObject.position.y > 0
		) {
			this.angle *= -1;
			syncAngle(this.angle);
		}

		if (
			Math.abs(this.ballObject.position.z) >=
			this.FIELD_SIZE.z - this.ballObject.size - FLAT_SURFACES_THICKNESS / 2
		) {
			let hitboxP1 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
			let hitboxP2 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
			let hitboxB = new THREE.Sphere(this.ballObject.position, this.ballObject.size * 1.25);
			hitboxP1.setFromObject(this.plank1);
			hitboxP2.setFromObject(this.plank2);
			//sprawdzenie czy cała piłka przekracza linię deski

			if (
				hitboxB.intersectsBox(hitboxP1) ||
				hitboxB.intersectsBox(hitboxP2)

				//hitbox dla pierwszej deski
				// (this.ballObject.position.x >=
				// 	this.plank1.position.x - this.plank1.width / 2 - this.ballObject.size &&
				// 	this.ballObject.position.x <=
				// 		this.plank1.position.x + this.plank1.width / 2 + this.ballObject.size &&
				// 	Math.abs(
				// 		this.ballObject.position.z + this.ballObject.size - this.FIELD_SIZE.z
				// 	) <= this.ballObject.size) ||
				// //hitbox dla drugiej deski
				// (this.ballObject.position.x >=
				// 	this.plank2.position.x - this.plank2.width / 2 - this.ballObject.size &&
				// 	this.ballObject.position.x <=
				// 		this.plank2.position.x + this.plank2.width / 2 + this.ballObject.size &&
				// 	Math.abs(
				// 		this.ballObject.position.z + this.ballObject.size + this.FIELD_SIZE.z
				// 	) <= this.ballObject.size)
			) {
				// console.log(this.ballObject.position, hitboxB);
				if (
					(this.ballObject.position.z > 0 && this.currentMove == 1) ||
					(this.ballObject.position.z < 0 && this.currentMove == -1)
				) {
					this.angle =
						Math.PI -
						this.angle -
						this.gamerId *
							(3 / 2) *
							Math.asin(
								(this.ballObject.position.x -
									this.currentlyMovingPlank.position.x) /
									(this.currentlyMovingPlank.width + this.ballObject.size * 2)
							);
					syncAngle(this.angle);
					this.updateCurrentMove(this.currentMove * -1);
				}
			} else {
				if (
					Math.abs(this.ballObject.position.z) >
					this.FIELD_SIZE.z * SAFEAREA_MULTIPLIER
				) {
					this.ballObject.position.y -= this.speed / 2;
					if (!this.gameStopped) {
						this.ballObject.position.z > 0 ? ඞ.emit("point", -1) : ඞ.emit("point", 1);
						this.gameStopped = true;
						setTimeout(() => {
							this.isFirstMove = true;
							syncIsFirstMove();

							setTimeout(() => {
								this.speed = this.defaultSpeed;
								this.plank1.editWidth(this.defaultPaletkaWidth);
								this.plank2.editWidth(this.defaultPaletkaWidth);
								this.ballObject.position.set(0, 400, 0);
								syncBall(this.ballObject.position, this.ballObject.rotation);
								this.gameStopped = false;
								this.gameStarted = false;
								this.resetCamera("3d");
								this.startGame();
								syncGameStart();
							}, 550);
						}, 2000);
					}
				}
			}
		}
		syncBall(this.ballObject.position, this.ballObject.rotation);
	};

	movePlankAccordingly = () => {
		if (!this.currentlyMovingPlank) return;
		if (
			!this.plankSpeed ||
			this.gameStopped ||
			(this.currentMove != this.gamerId && this.gameMode == "epic")
		)
			return;

		let multiplier = this.gamerId;

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
			// console.log(this.plankSpeed, multiplier);
			paletkaMove(this.currentlyMovingPlank.position);
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
			paletkaMove(this.currentlyMovingPlank.position);
			// this.camera.position.x -= this.plankSpeed * multiplier;
			// this.camera.updateProjectionMatrix();
		}
	};

	movePaletka = (id, newPos) => {
		let movedPaletka = id == 1 ? this.plank1 : this.plank2;
		movedPaletka.position.set(newPos.x, newPos.y, newPos.z);
	};

	ballMove = (newPos, newRotation) => {
		// if (newPos === this.ballObject.position) console.log(newPos);
		this.ballObject.position.set(newPos.x, newPos.y, newPos.z);
		// this.ballObject.rotation.set(newRotation.x, newRotation.y, newRotation.z);
		//console.log(newRotation);
	};

	changeAngle = (newAngle) => {
		this.angle = newAngle;
	};

	changeCurrentMove = (value) => {
		this.currentMove = value;
	};

	changeSpeed = (speed) => {
		this.speed = speed;
	};

	editOpponentsPlankWidth = (width) => {
		let edittedPlank = this.gamerId == 1 ? this.plank2 : this.plank1;
		edittedPlank.editWidth(width);
	};

	cam3dMode = () => {
		this.camera = this.camera3d;
		this.camera.aspect = this.aspect;
	};

	cam2dMode = () => {
		this.camera = this.camera2d;
	};

	windowResize = () => {
		this.aspect = window.innerWidth / window.innerHeight;
		if (this.camera === this.camera3d) {
			this.camera.aspect = this.aspect;
		} else {
			this.camera.left = this.FIELD_SIZE.z * -1 - 200;
			this.camera.right = this.FIELD_SIZE.z * 1 + 200;
			this.camera.top = this.FIELD_SIZE.x * 1 + 200 / this.aspect;
			this.camera.bottom = this.FIELD_SIZE.x * -1 - 200 / this.aspect;
		}
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	render = () => {
		//console.log(new Date());
		if (this.started) {
			this.movePlankAccordingly();
			if (this.gameStarted) {
				this.moveBall();
			}
			TWEEN.update();
		}
		requestAnimationFrame(this.render);
		this.renderer.render(this.scene, this.camera);
	};
}
