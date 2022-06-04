import Ball from "./Ball.js";
import Boundary from "./Boundary.js";
import Floor from "./Floor.js";
import Plank from "./Plank.js";

export default class Game {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		);

		this.camera.position.set(0, 230, 2200);
		this.camera.lookAt(this.scene.position);

		this.axes = new THREE.AxesHelper(1000);
		this.scene.add(this.axes);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0x143891);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.getElementById("root").appendChild(this.renderer.domElement);

		this.ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
		this.scene.add(this.ambientLight);

		this.dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
		this.dirLight.position.set(500, 400, 200);
		this.scene.add(this.dirLight);

		this.ballObject = new Ball();
		this.scene.add(this.ballObject);

		this.fieldSize = { x: 1125, z: 1800 };
		this.triggersActive = true;

		this.plank1 = null;
		this.plank2 = null;

		this.init();
	}

	init = () => {
		window.onresize = () => {
			this.windowResize();
		};

		// this.angle = Math.random() * 2 * Math.PI;
		this.angle = 0;
		this.speed = 12.5;
		this.ballObject.rotation.y = this.angle;
		this.ballObject.ball.rotation.y = -this.angle;

		this.addFloor();
		this.addBoundaries();
		this.addPlanks();
		this.render();
	};

	addFloor = () => {
		this.floor = new Floor(this.fieldSize.x * 2, this.fieldSize.z * 2);
		this.scene.add(this.floor);
	};

	addBoundaries = () => {
		let poses = [
			{ x: this.fieldSize.x, y: 15, z: 0, rotation: Math.PI / 2 },
			{ x: -this.fieldSize.x, y: 15, z: 0, rotation: Math.PI / 2 }
		];
		poses.forEach((pose) => {
			let boundary = new Boundary(this.fieldSize.z * 2, pose.x, pose.z, pose.rotation);
			this.scene.add(boundary);
		});
	};

	addPlanks = () => {
		this.plank1 = new Plank(this.fieldSize.z / 12.5, this.fieldSize.z + 12);
		this.scene.add(this.plank1);

		this.plank2 = new Plank(this.fieldSize.z / 12.5, -this.fieldSize.z - 12);
		this.scene.add(this.plank2);

		window.addEventListener("keydown", (e) => {
			switch (e.key) {
				case "a":
					this.plank1.movingRight = false;
					this.plank1.movingLeft = true;
					break;
				case "d":
					this.plank1.movingLeft = false;
					this.plank1.movingRight = true;
					break;
			}
		});

		window.addEventListener("keyup", (e) => {
			switch (e.key) {
				case "a":
					this.plank1.movingLeft = false;
					break;
				case "d":
					this.plank1.movingRight = false;
					break;
			}
		});
	};

	moveBall = () => {
		this.ballObject.position.x += Math.sin(this.angle) * this.speed * 3;
		this.ballObject.position.z += Math.cos(this.angle) * this.speed;

		this.ballObject.ball.rotation.x +=
			this.speed * (this.speed / (this.ballObject.size * Math.PI));

		if (Math.abs(this.ballObject.position.x) >= this.fieldSize.x - this.ballObject.size) {
			console.log("Odbicie X");
			this.angle *= -1;
			this.ballObject.rotation.y = this.angle;
		}

		if (Math.abs(this.ballObject.position.z) >= this.fieldSize.z - this.ballObject.size) {
			if (
				(this.ballObject.position.x >= this.plank1.position.x - this.plank1.width / 2 &&
					this.ballObject.position.x <= this.plank1.position.x + this.plank1.width / 2 &&
					this.ballObject.position.z > 0) ||
				(this.ballObject.position.x >= this.plank2.position.x - this.plank2.width / 2 &&
					this.ballObject.position.x <= this.plank2.position.x + this.plank2.width / 2 &&
					this.ballObject.position.z < 0 &&
					this.triggersActive)
			) {
				console.log("Odbicie Z");
				this.angle = Math.PI - this.angle;
				this.ballObject.rotation.y = this.angle;
			} else {
				if (this.triggersActive) {
					console.log("Punkt!");
					this.triggersActive = false;
					setTimeout(() => {
						this.angle = Math.random() * 2 * Math.PI;
						this.ballObject.setDefaultPos();
						this.ballObject.rotation.y = this.angle;
						this.triggersActive = true;
					}, 2000);
				} else {
					this.ballObject.position.y -= this.speed / 2;
				}
			}
		}
	};

	windowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	render = () => {
		if (this.plank1.movingRight) {
			this.camera.position.x += this.speed;
			this.plank1.position.x += this.speed * 1.25;
			this.camera.updateProjectionMatrix();
		}
		if (this.plank1.movingLeft) {
			this.camera.position.x -= this.speed;
			this.plank1.position.x -= this.speed * 1.25;
			this.camera.updateProjectionMatrix();
		}
		this.moveBall();
		requestAnimationFrame(this.render);
		this.renderer.render(this.scene, this.camera);
	};
}
