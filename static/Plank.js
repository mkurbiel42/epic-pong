import { FLAT_SURFACES_THICKNESS, SAFEAREA_MULTIPLIER } from "./Consts.js";

export default class Plank extends THREE.Mesh {
	constructor(width, z) {
		super();
		this.width = width;
		this.movingLeft = false;
		this.movingRight = false;
		this.z = z;
		this.height = 102;
		this.geometry = new THREE.BoxGeometry(width, this.height, FLAT_SURFACES_THICKNESS);

		this.texture = new THREE.TextureLoader().load("./gfx/woodTexture.jpg");
		this.texture.repeat.set(2, 1);
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.wrapT = THREE.RepeatWrapping;

		this.material = new THREE.MeshPhongMaterial({
			shininess: 10,
			color: 0x824c05,
			side: THREE.DoubleSide,
			map: this.texture
		});

		this.setDefaultPos();
		this.defaultPos = { x: 0, y: this.height / 2, z: this.z };
	}

	setDefaultPos = () => {
		this.position.set(0, this.height / 2, this.z);
	};

	editWidth = (newWidth) => {
		this.geometry = new THREE.BoxGeometry(newWidth, this.height, FLAT_SURFACES_THICKNESS);
		this.width = newWidth;
	};
}
