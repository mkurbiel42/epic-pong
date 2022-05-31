const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	90,
	window.innerWidth / window.innerHeight,
	0.1,
	10000
);

window.onresize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};

const axes = new THREE.AxesHelper(1000);
scene.add(axes);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xffffff);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("root").appendChild(renderer.domElement);

const ballMaterial = new THREE.MeshBasicMaterial({
	color: 0xab1637,
	side: THREE.DoubleSide,
});
const ballGeometry = new THREE.SphereGeometry(50);
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);

let angle = Math.PI / 7;
let speed = 3;

// let angleChange = setInterval(() => {
// 	angle = Math.random() * 2 * Math.PI - Math.PI;
// }, 1500);

scene.add(ballMesh);
camera.position.set(500, 450, 500);
camera.lookAt(scene.position);

function render() {
	ballMesh.position.x += Math.cos(angle) * speed;
	ballMesh.position.z += Math.sin(angle) * speed;
	if (Math.abs(ballMesh.position.x) >= 200) {
		console.log("Odbicie X");
		angle = Math.PI - angle;
	}

	if (Math.abs(ballMesh.position.z) >= 200) {
		console.log("Odbicie Z");
		angle *= -1;
	}
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();
