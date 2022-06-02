import Ball from "./Ball.js";
import Boundary from "./Boundary.js";

export default class Game {
	constructor() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			90,
			window.innerWidth / window.innerHeight,
			0.1,
			10000
		);

		this.camera.position.set(500, 450, 500);
		this.camera.lookAt(this.scene.position);

		this.axes = new THREE.AxesHelper(1000);
		this.scene.add(this.axes);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setClearColor(0x143891);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.dirLight = new THREE.DirectionalLight(0xffff91, 0.8);
		this.dirLight.position.set(500, 400, 200);
		this.scene.add(this.dirLight);

		this.ballObject = new Ball();
		this.scene.add(this.ballObject);

		this.fieldSize = { x: 400, z: 600 };

		this.init();
	}

	init = () => {
		document.getElementById("root").appendChild(this.renderer.domElement);

		window.onresize = () => {
			this.windowResize();
		};

		this.angle = Math.PI / 3;
		this.speed = 3;
		this.ballObject.rotation.y = this.angle;
		this.ballObject.ball.rotation.y = -this.angle;

		this.addBoundaries();
		this.render();
	};

	addBoundaries = () => {
		let poses = [
			{ x: this.fieldSize.x, y: 15, z: 0, rotation: Math.PI / 2 },
			{ x: 0, y: 15, z: this.fieldSize.z, rotation: 0 },
			{ x: -this.fieldSize.x, y: 15, z: 0, rotation: Math.PI / 2 },
			{ x: 0, y: 15, z: -this.fieldSize.z, rotation: 0 },
		];
		for (let i = 0; i < 4; i++) {
			console.log(poses[i].x);
			let boundary;
			if (i % 2 == 0) {
				boundary = new Boundary(this.fieldSize.z * 2);
			} else {
				boundary = new Boundary(this.fieldSize.x * 2);
			}

			boundary.position.set(poses[i].x, poses[i].y, poses[i].z);
			boundary.rotation.y = poses[i].rotation;
			this.scene.add(boundary);
		}
	};

	moveBall = () => {
		this.ballObject.position.x += Math.sin(this.angle) * this.speed;
		this.ballObject.position.z += Math.cos(this.angle) * this.speed;

		this.ballObject.ball.rotation.x +=
			this.speed * (this.speed / (this.ballObject.size * Math.PI));

		if (
			Math.abs(this.ballObject.position.x) >=
			this.fieldSize.x - this.ballObject.size
		) {
			console.log("Odbicie X");
			this.angle *= -1;
			this.ballObject.rotation.y = this.angle;
		}

		if (
			Math.abs(this.ballObject.position.z) >=
			this.fieldSize.z - this.ballObject.size
		) {
			console.log("Odbicie Z");
			this.angle = Math.PI - this.angle;
			this.ballObject.rotation.y = this.angle;
		}
	};

	windowResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	render = () => {
		this.moveBall();
		requestAnimationFrame(this.render);
		this.renderer.render(this.scene, this.camera);
	};
}
