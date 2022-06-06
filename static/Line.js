import { LINE_WIDTH } from "./Consts.js";

export default class Line extends THREE.Mesh {
	constructor(width, x, z) {
		super();
		this.width = width;
		this.x = x;
		this.z = z;
		this.geometry = new THREE.PlaneGeometry(width, LINE_WIDTH);
		this.material = new THREE.MeshPhongMaterial({ color: 0xefefef, shininess: 55 });
		this.position.set(x, 1, z);
		this.rotation.x = -Math.PI / 2;
	}
}
