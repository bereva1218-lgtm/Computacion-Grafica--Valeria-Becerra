import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. ESCENA, CÁMARA Y RENDER
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a); // Noche azulada

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 12, 25);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 10, 0);
controls.update();

// 2. ILUMINACIÓN Y PISO
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(15, 30, 20);
dirLight.castShadow = true;
scene.add(dirLight);

const floorGeo = new THREE.PlaneGeometry(40, 40);
const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// =========================================================
// TODO: CONSTRUIR LA RUEDA DE LA FORTUNA
// =========================================================
// En esta seccion, debes crear la rueda de la fortuna utilizando geometrías y materiales de Three.js. 

const baseRueda = new THREE.MeshStandardMaterial({ color: 0x8b5cf6});
const metal = new THREE.MeshStandardMaterial({color: 0x888888})

//guia para la rueda
const ejeGeom = new THREE.CylinderGeometry(0.8,0.8,8,16);
const eje = new THREE.Mesh(ejeGeom, baseRueda);
eje.rotation.x = Math.PI/2;
eje.position.y = 12;
// no alñaid lo de castShadow 
scene.add(eje);

// Patas 
const pataGeo = new THREE.CylinderGeometry(0.5,0.5,16,16);
for(let i = -1; i <= 1; i+=2){
    for (let j = -1; j <= 1; j+=2){
        const pata = new THREE.Mesh(pataGeo, baseRueda);
        pata.position.set(0,6, i * 4);
        pata.rotation.z = j *(Math.PI/ 8);
        // no añadi lo de castShadow 
        scene.add(pata);
    }
}
// Lo que conforma la rueda

const rueda = new THREE.Group();
rueda.position.y = 12;
scene.add(rueda);
const radioRueda = 9;

// rueda centro del cilindro base

const esferaGeo = new THREE.SphereGeometry(1,50,45);
const esferaMaterial = new THREE.MeshStandardMaterial({color: 0xe69b00});
const esfera = new THREE.Mesh(esferaGeo, esferaMaterial);
esfera.rotation.x = Math.PI/2;
rueda.add(esfera);


const aroGeo = new THREE.TorusGeometry(radioRueda, 0.2,20,64)
const aro1 = new THREE.Mesh(aroGeo, metal);
const aro2 = new THREE.Mesh(aroGeo, metal);
aro1.position.z = 2.7;
aro2.position.z = -2.7;
rueda.add(aro1, aro2);


const numCabinas = 8;
const cabinas = [];
// la cabia esa una caja entonces box
const cabinaCaja = new THREE.BoxGeometry(2,1.5,2)
// el techo es un cono
const cabinaTecho = new THREE.ConeGeometry(1.5,1.5,4)
const cabinaMaterial = new THREE.MeshStandardMaterial({color: 0x0000ff});
const techoMaterial = new THREE.MeshStandardMaterial({color: 0xFf0000});

const soportesGeo = new THREE.CylinderGeometry(0.1,0.1,radioRueda * 2);
const crossbarGeo = new THREE.CylinderGeometry(0.12,0,12,3.2);
const gannchosGeo = new THREE.CylinderGeometry(0.1,0.1,0.25);

// cree la forma de los conos por cada cabina
for (let i= 0; i < numCabinas; i++){
    // como es un circulo la ubicacion en el radio es por PI
    const ubicacionCabina =  (i / numCabinas) * Math.PI * 2;

    // creo un grupo para agrupar las bases 
    const soportesGrupos  = new THREE.Group();

    // ahora los cilindros conectados al eje principal de la rueda
    const radioCilindroGeo = new THREE.CylinderGeometry(0.1,0.1, radioRueda *2)
    const estructuraRadio = new THREE.Mesh(radioCilindroGeo, metal);
    rueda.add(estructuraRadio);
    estructuraRadio.rotation.z = ubicacionCabina;

    // Cabinas
    const cabinaGroup = new THREE.Group();
    cabinaGroup.position.set(radioRueda * Math.cos(ubicacionCabina), radioRueda * Math.sin(ubicacionCabina), 0);
    
    const caja = new THREE.Mesh(cabinaCaja, cabinaMaterial);
    caja.position.y = -0.75;
    caja.castShadow = true;
    
    const techo = new THREE.Mesh(cabinaTecho, techoMaterial);
    techo.position.y = 0.75;
    techo.rotation.y = Math.PI / 4;
    techo.castShadow = true;
    
    cabinaGroup.add(caja, techo);
    rueda.add(cabinaGroup);
    cabinas.push(cabinaGroup);

}


// Loop de Animación
let velocidadGiro = 0.01;

function animate() {
    requestAnimationFrame(animate);

    // Aqui colocar el codigo de Rotación de la rueda
    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});