import Ball from "./Ball.js";
import Boundary from "./Boundary.js";
import Floor from "./Floor.js";
import Plank from "./Plank.js";
import Line from "./Line.js";
import { FLAT_SURFACES_THICKNESS, SAFEAREA_MULTIPLIER } from "./Consts.js";

export default class Game {
	constructor() {
		// definicje sceny i kamery
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		);
		this.resetCamera();

		// dodanie pomocniczych osi (usunąć później!)
		// this.axes = new THREE.AxesHelper(1000);
		// this.scene.add(this.axes);

		// renderer
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0x143891);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById("root").appendChild(this.renderer.domElement);

		// domyślne zmienne
		this.FIELD_SIZE = { x: 1125, z: 1800 }; //rozmiar pola gry

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

		this.addBall();
		this.addLights();
		this.addFloor();
		this.addBoundaries();
		this.addLines();
		this.addPlanks();
		this.render();
		this.startGame();
	};

	startGame = () => {
		let waitTime = 1000;

		new TWEEN.Tween(this.ballObject.position)
			.to(this.ballObject.defaultPos, waitTime)
			.easing(TWEEN.Easing.Bounce.Out)
			.start();

		this.setPlanksToDefaultPoses();
		setTimeout(() => {
			// domyślny kąt toczenia się piłki i prędkość
			this.getRandomAngle();
			this.speed = 18;
			this.plankSpeed = 12;
			this.ballObject.rotation.y = this.angle;
			this.ballObject.ball.rotation.y = -this.angle;
			this.gameStarted = true;
			this.gameStopped = false;
		}, waitTime + 0.25);
	};

	resetCamera = () => {
		//ustawienie kamery dla gracza 1
		this.camera.position.set(0, 400, 2400);
		this.camera.lookAt(this.scene.position);
		this.camera.updateProjectionMatrix();
	};

	getRandomAngle = () => {
		do {
			this.angle = Math.random() * 2 * Math.PI - Math.PI;
			console.log(this.angle);
			console.log(Math.abs(Math.PI / 2 - Math.abs(this.angle)));
		} while (Math.abs(Math.PI / 2 - Math.abs(this.angle)) < Math.PI / 9);
		Math.abs(this.angle) > Math.PI / 2 ? this.updateCurrentMove(-1) : this.updateCurrentMove(1);
		this.allowPlankMovement = true;
	};

	updateCurrentMove = (value) => {
		this.currentMove = value;
		if (value == -1) {
			this.currentlyMovingPlank = this.plank2;
		} else if (value == 1) {
			this.currentlyMovingPlank = this.plank1;
		} else {
			this.currentlyMovingPlank = null;
		}

		if (this.currentlyMovingPlank && this.gameStarted) {
			setTimeout(() => {
				this.gameStarted = false;
				this.allowPlankMovement = true;
				setTimeout(() => {
					this.allowPlankMovement = false;
					this.gameStarted = true;
				}, 5000);
			}, 1000);
		}

		this.plank1.movingLeft = false;
		this.plank1.movingRight = false;
		this.plank2.movingLeft = false;
		this.plank2.movingRight = false;
	};

	addBall = () => {
		// utworzenie piłki
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
		this.plank1 = new Plank(this.FIELD_SIZE.z / 12.5, this.FIELD_SIZE.z + 12);
		this.plank1.name = "plank1";
		this.scene.add(this.plank1);

		this.plank2 = new Plank(this.FIELD_SIZE.z / 12.5, -this.FIELD_SIZE.z - 12);
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
		new TWEEN.Tween(this.plank1.position)
			.to(this.plank1.defaultPos, 1300)
			.easing(TWEEN.Easing.Bounce.Out)
			.start();
		new TWEEN.Tween(this.plank2.position)
			.to(this.plank2.defaultPos, 1300)
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
			console.log("Odbicie X");
			this.angle *= -1;
			this.ballObject.rotation.y = this.angle;
		}

		if (Math.abs(this.ballObject.position.z) >= this.FIELD_SIZE.z - this.ballObject.size) {
			//sprawdzenie czy cała piłka przekracza linię deski
			if (
				//hitbox dla pierwszej deski
				(this.ballObject.position.x >=
					this.plank1.position.x - this.plank1.width / 2 - this.ballObject.size &&
					this.ballObject.position.x <=
						this.plank1.position.x + this.plank1.width / 2 + this.ballObject.size &&
					Math.abs(this.ballObject.position.z - this.FIELD_SIZE.z) <=
						this.ballObject.size) ||
				//hitbox dla drugiej deski
				(this.ballObject.position.x >=
					this.plank2.position.x - this.plank2.width / 2 - this.ballObject.size &&
					this.ballObject.position.x <=
						this.plank2.position.x + this.plank2.width / 2 + this.ballObject.size &&
					Math.abs(this.ballObject.position.z + this.FIELD_SIZE.z) <=
						this.ballObject.size)
			) {
				//odbicie piłki od deski
				if (this.ballObject.position.z > 0 && this.currentMove == 1) {
					this.angle =
						Math.PI -
						this.angle -
						(3 / 2) *
							Math.asin(
								(this.ballObject.position.x - this.plank1.position.x) /
									this.plank1.width
							);
					this.updateCurrentMove(-1);
				} else if (this.ballObject.position.z < 0 && this.currentMove == -1) {
					this.angle =
						Math.PI -
						this.angle +
						(3 / 2) *
							Math.asin(
								(this.ballObject.position.x - this.plank2.position.x) /
									this.plank2.width
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
							this.ballObject.position.set(0, 400, 0);
							this.gameStopped = false;
							this.gameStarted = false;
							this.startGame();
							// this.resetCamera();
						}, 2000);
					}
				}
			}
		}
	};

	movePlankAccordingly = () => {
		if (!this.currentlyMovingPlank) return;
		if (!this.allowPlankMovement || this.gameStoppedd) return;

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
			this.camera.position.x += this.plankSpeed * multiplier;
			this.camera.updateProjectionMatrix();
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
			this.camera.position.x -= this.plankSpeed * multiplier;
			this.camera.updateProjectionMatrix();
		}
	};

	windowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
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
