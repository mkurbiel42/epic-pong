export default class Boundary extends THREE.Mesh {
	constructor(width, x, z, rotation) {
		super();
		this.height = 66;

		this.position.set(x, this.height / 2, z);
		this.rotation.y = rotation;

		this.width = width;
		this.geometry = new THREE.BoxGeometry(this.width, this.height, 3);

		(this.texture = new THREE.TextureLoader().load("./gfx/woodTexture.jpg")),
			this.texture.repeat.set(32, 0.25);
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.wrapT = THREE.RepeatWrapping;

		this.material = new THREE.MeshPhongMaterial({
			shininess: 10,
			color: 0x824c05,
			side: THREE.DoubleSide,
			map: this.texture,
		});
	}
}
