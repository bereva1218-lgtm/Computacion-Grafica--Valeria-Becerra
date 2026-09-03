import * as THREE from 'three';
// los Orbit control son los que necesito para mover el escenario 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//TRINIDAD BASICA 
const scene = new THREE.Scene(); // contenedor donde va estar la escena 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//es una camara que simula una real, con 75 de campo de vision en grados, aspecto de ancho (pantalla) 
//0.1 y 1000 son los limites de profundidad, lo que este antes de 0.1 o despues de 100 no se renderiza
const renderer = new THREE.WebGLRenderer(); // Esto es lo que renderiza todo
renderer.setSize(window.innerWidth, window.innerHeight);

// Configurar el color de fondo
const backgroundColor = new THREE.Color(0x1D1D96);
renderer.setClearColor(backgroundColor);

renderer.setAnimationLoop(animate); // le dice al render que llame a la funcion animate en cada frame 
document.body.appendChild(renderer.domElement); // esto es el CANVAS para que se vea en el html, es como un contenedor donde se va a ver la escena

//LIGHTS
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 ); // sirve para que se ilumine todo por igual, hasta las partes con sombra
scene.add( ambientLight );

const light = new THREE.DirectionalLight( 0xffffff, 1.2 ); // simula una fuente cercana de luz 
// la posicin define desde donde viene esa luz, apunta hacia el origen por defecto
light.position.set( 0, 0, 7 );
scene.add( light );

//creacion de los planetas
//Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno) 

const Planets= [
    {
        name: 'Sol',
        geometry: new THREE.SphereGeometry(4,32,32),
        color: 0xffff00,
        posX:0
    },
    {
        name: 'Mercurio',
        geometry: new THREE.SphereGeometry(0.5,32,32),
        color: 0x9e9e9e,
        posX:6
    },
    {
        name: 'Venus',
        geometry: new THREE.SphereGeometry(0.6,32,32),
        color: 0xff9800,
        posX:8
    },
    {
        name: 'Tierra',
        geometry: new THREE.SphereGeometry(1.1,32,32),
        color: 0x008F39,
        posX:11
    },
    {
        name: 'Marte',
        geometry: new THREE.SphereGeometry(1.2,32,40),
        color: 0xFf0000,
        posX:15
    },
    {
        name: 'Júpiter',
        geometry: new THREE.SphereGeometry(2,32,40),
        color: 0xffeb3b,
        posX:20
    },
    {
        name: 'Saturno',
        geometry: new THREE.SphereGeometry(2.3,32,32),
        color: 0xffc107,
        posX:29
    },
    {
        name: 'Urano',
        geometry: new THREE.SphereGeometry(3,32,32),
        color: 0x00bcd4,
        posX:39
    },
    {
        name: 'Neptuno',
        geometry: new THREE.SphereGeometry(3.5,32,32),
        color: 0x3f51b5,
        posX:50
    }

];

const meshes = [];

Planets.forEach((planet) => {
    const material = new THREE.MeshStandardMaterial({ color: planet.color });
    // MeshStandartMaterial es el que mejor reacciona a la luz
    // a cada elemento del shapedata, les pone el color que se le puso
    const mesh = new THREE.Mesh(planet.geometry, material);
    mesh.position.x = planet.posX;
    scene.add(mesh);
    meshes.push(mesh);
});


const AnilloGeometry = new THREE.RingGeometry(2.8, 4.2, 32);

const AnilloMaterial = new THREE.MeshBasicMaterial({color: 0x808080,side: THREE.DoubleSide});

const ring = new THREE.Mesh(
    AnilloGeometry,
    AnilloMaterial
);

ring.rotation.x = Math.PI / 2;
ring.position.x = 29; 

scene.add(ring);

//ESTO ES LO DE ORBITS
const controls = new OrbitControls(camera, renderer.domElement); // vincula la camara y el mouse del render para mver
camera.position.set(0, -20, 35);
controls.update();

function animate(time) {
    renderer.render(scene, camera); // linea que realmente dibuja el frame actual
    controls.update();
}
// Handle Responsive Resizing
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
