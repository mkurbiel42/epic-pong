import Ball from "./Ball.js";

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

		this.ball = new Ball();
		this.scene.add(this.ball);

		this.init();
	}

	init = () => {
		document.getElementById("root").appendChild(this.renderer.domElement);

		window.onresize = () => {
			this.windowResize();
		};

		this.angle = Math.PI / 4;
		this.speed = 3;

		this.render();
	};

	moveBall = () => {
		this.ball.position.x += Math.cos(this.angle) * this.speed;
		this.ball.position.z += Math.sin(this.angle) * this.speed;

		this.ball.rotation.x += Math.sin(this.angle) * this.speed * (this.speed / this.ball.size);
		this.ball.rotation.z -= Math.cos(this.angle) * this.speed * (this.speed / this.ball.size);
		//this.ball.rotation.y += Math.sin(this.angle) * this.speed * (this.speed / this.ball.size);

		if (Math.abs(this.ball.position.x) >= 400) {
			console.log("Odbicie X");
			this.angle = Math.PI - this.angle;
		}

		if (Math.abs(this.ball.position.z) >= 400) {
			console.log("Odbicie Z");
			this.angle *= -1;
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
