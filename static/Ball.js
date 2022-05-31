export default class Ball extends THREE.Mesh {
	constructor() {
		super();
		this.size = 50;
		this.material = new THREE.MeshPhongMaterial({
			shininess: 20,
			color: 0xab1637,
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load("./gfx/woodTexture.jpg")
		});
		this.geometry = new THREE.SphereGeometry(this.size);
	}
}
