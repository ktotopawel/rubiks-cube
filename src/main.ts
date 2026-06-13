import * as three from "three";
import {OrbitControls} from "three/examples/jsm/Addons.js";
import renderUi from "./buttons";
import "./styles.css";
import {scrambleFn, solveFn, type Move} from "./move";

const scene = new three.Scene();
scene.background = new three.Color(0x1a1a1a);

const starGeometry = new three.BufferGeometry();
const starCount = 2000;
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3; i++) {
    starPositions[i] = (Math.random() - 0.5) * 200;
}

starGeometry.setAttribute(
    "position",
    new three.BufferAttribute(starPositions, 3)
);

const starMaterial = new three.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
});

const stars = new three.Points(starGeometry, starMaterial);
scene.add(stars);

const camera = new three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
);
camera.position.z = 5;

const renderer = new three.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;

controls.addEventListener("start", () => {
    controls.autoRotate = false;
});

const ambientLight = new three.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new three.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const geometry = new three.BoxGeometry(1, 1, 1);

const blackMaterial = new three.MeshStandardMaterial({color: 0x222222});

const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500, 0xffffff];
const coloredMaterials = colors.map(
    (color) => new three.MeshStandardMaterial({color}),
);

const allCubes: three.Mesh[] = [];

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;

            const cubeMaterials = [
                x === 1 ? coloredMaterials[0] : blackMaterial,
                x === -1 ? coloredMaterials[1] : blackMaterial,
                y === 1 ? coloredMaterials[2] : blackMaterial,
                y === -1 ? coloredMaterials[3] : blackMaterial,
                z === 1 ? coloredMaterials[4] : blackMaterial,
                z === -1 ? coloredMaterials[5] : blackMaterial,
            ];

            const subCube = new three.Mesh(geometry, cubeMaterials);
            subCube.position.set(x * 1.05, y * 1.05, z * 1.05);
            scene.add(subCube);
            allCubes.push(subCube);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    stars.rotation.y += 0.00015;

    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const {scramble, solve} = renderUi();

let moveHistory: Move[] = [];

scramble.addEventListener("click", async () => {
    scramble.disabled = true;
    solve.disabled = true;
    const moves = await scrambleFn(scene, allCubes, 10);
    moveHistory.push(...moves);
    scramble.disabled = false;
    solve.disabled = false;
});

solve.addEventListener("click", async () => {
    scramble.disabled = true;
    solve.disabled = true;
    await solveFn(scene, allCubes, moveHistory);
    moveHistory = [];
    scramble.disabled = false;
    solve.disabled = false;
});
