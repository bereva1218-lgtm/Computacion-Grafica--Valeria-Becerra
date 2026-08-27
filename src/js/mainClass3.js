
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.display = 'block';
renderer.domElement.style.width = '100%';
const backgroundColor = new THREE.Color(0xF2ADFF);
renderer.setClearColor(backgroundColor);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
scene.add( ambientLight );

const light = new THREE.DirectionalLight( 0xffffff, 1.2 );
light.position.set( 5, 10, 7 );
scene.add( light );

// DEFINITION OF PRIMITIVE SHAPES
const shapesData = [
    {
        name: 'Cube',
        geometry: new THREE.BoxGeometry( 1, 1, 1 ),
        color: 0x00ffff, 
        posX: -6
    },
    // creation of a sphere
    {
        name: 'Sphere',
        geometry: new THREE.SphereGeometry( 1, 32, 32 ),    
        color: 0x00e676,
        posX: -3
    },
    {
        // creation of cylinder
        name: 'Cylinder',   
        geometry: new THREE.CylinderGeometry( 1, 1, 4, 32 ),
        color: 0xff9800,
        posX: 0
    },
    // creation of torus
    {
        name: 'Torus',
        geometry: new THREE.TorusGeometry( 1, 0.4, 16, 100 ),
        color: 0x9c27b0,
        posX: 3
    },
    //creation of a cone
    {
        name: 'Cone',
        geometry: new THREE.ConeGeometry( 1, 4, 32 ),   
        color: 0xf44336,
        posX: 6
    }
];

const meshes = [];
let isWireframe = false;

shapesData.forEach( ( shapeData ) => {
    const material = new THREE.MeshStandardMaterial( { color: shapeData.color, wireframe: isWireframe, roughness: 0.3, metalness: 0.2} );
    const mesh = new THREE.Mesh( shapeData.geometry, material );
    mesh.position.x = shapeData.posX;
    scene.add( mesh );
    meshes.push( mesh );
} );

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, -1.5, 16);
controls.update();

// grilla para guiarme 
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

// para ver las coordenadas x,y,z
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


function animate(time) {
    renderer.render(scene, camera);
    controls.update();

    meshes.forEach( (mesh ) => {
        const speed = 0.0009;
        mesh.rotation.x = time * speed;
        mesh.rotation.y = time * speed;
    });
}
