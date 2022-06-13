import { LINE_WIDTH } from "./Consts.js";

export default class Line extends THREE.Mesh {
	constructor(width, x, z, color) {
		super();
		this.width = width;
		this.x = x;
		this.z = z;
		this.color = color;
		this.geometry = new THREE.PlaneGeometry(width, LINE_WIDTH);
		this.material = new THREE.MeshPhongMaterial({ color: this.color, shininess: 55 });
		this.position.set(x, 1.5, z);
		this.rotation.x = -Math.PI / 2;
	}
}
