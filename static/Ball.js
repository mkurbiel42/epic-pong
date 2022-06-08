export default class Ball extends THREE.Object3D {
	constructor() {
		super();
		this.size = 30;
		this.ballMaterial = new THREE.MeshPhongMaterial({
			shininess: 20,
			color: 0xab1637,
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load("./gfx/woodTexture.jpg")
		});
		this.defaultPos = { x: 0, y: this.size, z: 0 };
		// this.ballGeometry = new THREE.BoxGeometry(this.size, this.size, this.size);
		this.ballGeometry = new THREE.SphereGeometry(this.size);

		// this.helperMaterial = new THREE.MeshPhongMaterial({
		// 	shininess: 20,
		// 	color: 0x123659,
		// 	side: THREE.DoubleSide,
		// 	map: new THREE.TextureLoader().load("./gfx/woodTexture.jpg"),
		// });
		// this.helperGeometry = new THREE.BoxGeometry(20, 20, this.size * 2 + 20);

		// this.helper = new THREE.Mesh(this.helperGeometry, this.helperMaterial);
		// this.helper.position.set(0, 0, 40);
		// this.add(this.helper);

		this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
		this.add(this.ball);
		this.setDefaultPos();
	}

	setDefaultPos = () => {
		this.position.set(0, this.size, 0);
	};
}
