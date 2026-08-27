
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// creation of a cube 
const geometry = new THREE.BoxGeometry( 1, 5, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x0200FF, wireframe: true } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

//camera.position.z = 4
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set(0,-1.5,10);
controls.update();

// grilla para guiarme 
const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

// para ver las coordenadas x,y,z
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );


function animate( time ) {

  cube.rotation.x = time / 1000;
  cube.rotation.y = time / 1000;

  renderer.render( scene, camera );
  controls.update();

}
