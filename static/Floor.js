import { FLAT_SURFACES_THICKNESS, SAFEAREA_EXPONENT } from "Consts.js";

export default class Floor extends THREE.Mesh {
	constructor(width, length) {
		super();
		this.geometry = new THREE.BoxGeometry(
			width + FLAT_SURFACES_THICKNESS,
			FLAT_SURFACES_THICKNESS,
			length
		);
		this.texture = new THREE.TextureLoader().load("./gfx/floorTexture.jpg");
		this.texture.repeat.set(4, 4);
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.wrapT = THREE.RepeatWrapping;
		this.material = new THREE.MeshPhongMaterial({
			shininess: 10,
			color: 0xe3af4f,
			map: this.texture
		});
		this.position.y = -FLAT_SURFACES_THICKNESS / 2;
	}
}
