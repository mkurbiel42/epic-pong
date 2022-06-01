export default class Boundary extends THREE.Mesh {
	constructor(width) {
		super();
		this.width = width;
		this.geometry = new THREE.BoxGeometry(this.width, 30, 5);
		this.material = new THREE.MeshPhongMaterial({
			shininess: 10,
			color: 0x896412,
			side: THREE.DoubleSide,
			map: new THREE.TextureLoader().load("./gfx/woodTexture.jpg"),
		});
	}
}
