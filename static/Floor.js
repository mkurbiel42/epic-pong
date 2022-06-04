export default class Floor extends THREE.Mesh {
	constructor(width, length) {
		super();
		this.geometry = new THREE.PlaneGeometry(width, length);
		this.texture = new THREE.TextureLoader().load("./gfx/floorTexture.jpg");
		this.texture.repeat.set(4, 4);
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.wrapT = THREE.RepeatWrapping;
		this.material = new THREE.MeshPhongMaterial({
			shininess: 10,
			color: 0xe3af4f,
			map: this.texture,
		});

		this.rotation.x = -Math.PI / 2;
	}
}
