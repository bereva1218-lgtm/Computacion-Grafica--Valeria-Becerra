import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const backgroundColor = 0x0b0c10; // Dark background color
scene.background = new THREE.Color(backgroundColor);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1.2);
light.position.set(50, 10, 10);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, -1.5, 9);
controls.update();

// Grid  Helper
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// Axes Helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate(time) {
    renderer.render(scene, camera);
    controls.update();
}

// 2. Handle Responsive Resizing
function onWindowResize() {
    // Update camera aspect ratio based on the new container bounds
    camera.aspect = window.innerWidth / window.innerHeight;

    // Crucial: Update the projection matrix to apply changes
    camera.updateProjectionMatrix();

    // Update renderer size and pixel ratio
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// 3. Listen for the resize event
window.addEventListener('resize', onWindowResize);

// *******************************************
// CARGAR EL MODELO CON SU MATERIAL
const objLoader = new OBJLoader();

objLoader.setPath('./obj-mlt/');
const mtlLoader = new MTLLoader();
mtlLoader.setPath('./obj-mlt/');
mtlLoader.load('snoopy.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('snoopy.obj', (root) => {
        // Girar 180° para que mire hacia la cámara y las luces
        root.rotation.y = Math.PI;
        scene.add(root);
    });
});

// *******************************************
//  GLTF LOADER
{
  const gltfLoader = new GLTFLoader();
  const url = './models/gltf/snoopy.gltf';
  gltfLoader.load(url, (gltf) => {
    const root = gltf.scene;
    scene.add(root);
    // A un lado del modelo OBJ para que no se encimen
    root.position.set(3.5, 0, 0);
    // Girar 180° para que mire hacia la cámara y las luces
    root.rotation.y = Math.PI;

    // Luz frontal que apunta al Snoopy GLTF
    const gltfLight = new THREE.DirectionalLight(0xffffff, 2);
    gltfLight.position.set(3.5, 5, 8);
    gltfLight.target = root;
    scene.add(gltfLight);
  });
}