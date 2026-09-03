
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

//esto lo que hace es crear una variable constante de fondo 
const backgroundColor = new THREE.Color(0xF2ADFF);
renderer.setClearColor(backgroundColor);

renderer.setAnimationLoop(animate); // le dice al render que llame a la funcion animate en cada frame 
document.body.appendChild(renderer.domElement); // esto es el CANVAS para que se vea en el html, es como un contenedor donde se va a ver la escena

//LIGHTS
const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 ); // sirve para que se ilumine todo por igual, hasta las partes con sombra
scene.add( ambientLight );

const light = new THREE.DirectionalLight( 0xffffff, 1.2 ); // simula una fuente cercana de luz 
// la posicin define desde donde viene esa luz, apunta hacia el origen por defecto
light.position.set( 2, 15, 10 );
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
let isWireframe = false; // esto es para que las mallas esten por defecto sin activar

shapesData.forEach( ( shapeData ) => {
    const material = new THREE.MeshStandardMaterial( { color: shapeData.color, wireframe: isWireframe, roughness: 0.3, metalness: 0.2} );
    // MeshStandartMaterial es el que mejor reacciona a la luz
    // a cada elemento del shapedata, les pone el color que se le puso
    const mesh = new THREE.Mesh( shapeData.geometry, material );
    //EL MESH ES EL OBJETO QUE SE VA A RENDERIZAR COMO TAL, LA GEOMETRÍA + EL MATERIAL
    mesh.position.x = shapeData.posX;
    scene.add( mesh ); // a la escena le agrego el mesh que acabo de crear
    meshes.push( mesh ); // los agrego al arreglo 
} );

//ESTO ES LO DE ORBITS
const controls = new OrbitControls(camera, renderer.domElement); // vincula la camara y el mouse del render para mver
camera.position.set(0, -1.5, 16);
controls.update();

// grilla para guiarme 
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions); // dibuja una grilla en el plano xz
scene.add(gridHelper);

// para ver las coordenadas x,y,z
const axesHelper = new THREE.AxesHelper(5); // con longitud 5
scene.add(axesHelper);


function animate(time) {
    renderer.render(scene, camera); // linea que realmente dibuja el frame actual
    controls.update();

    meshes.forEach( (mesh ) => {
        const speed = 0.0009;
        mesh.rotation.x = time * speed;
        mesh.rotation.y = time * speed;
    });
// BOTON PARA ACTIVAR Y DESACTIVAR EL WIREFRAM
}
// RESPONSIVE
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

const botom = document.getElementById('wireframe-button'); //hay q crear un boton en el html con el id wireframe-button
function MallaActiva(){
    isWireframe=!isWireframe;
    meshes.forEach( (mesh) => {
        mesh.material.wireframe = isWireframe;
    })
    if (isWireframe){
        botom.innerHTML = "Desactivar Malla";
    }
    else{
        botom.innerHTML = "Activar Malla";
    }
}
botom.addEventListener('click', MallaActiva);

