import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollToPlugin);
gsap.registerPlugin(MotionPathPlugin) 


///
//initialisation des variables
///
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const pointsDArret = [
    {x: 0, y: 0, distance: '150 km', planete: 'Terre'},
    {x: 60, y: 50, distance: '300 000 000 km', planete: 'Mars'},
    {x: 140, y: 0, distance: '591 000 000 km', planete: 'Jupiter'},
    {x: 270, y: 50, distance: '1 300 000 000 km', planete: 'Saturne'},
    {x: 350, y: 0, distance:'2 3000 000 000 km', planete: 'Uranus'},
    {x: 450, y: 50, distance: '4 300 000 000 km', planete: 'Neptune'},
    {x: 550, y: 0, distance: '4 800 000 000 km', planete: 'Pluton'},
];

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let my3DObject = null;
let deuxiemeObject = null;
let troisiemeObject = null;
let mars = null;
let jupiter = null;
let planetes = {
    intro1: {div: document.getElementById('intro1'), element: document.getElementById('introo1')},
    intro2: {div: document.getElementById('intro2'), element: document.getElementById('introo2')},
    intro3: {div: document.getElementById('intro3'), element: document.getElementById('introo3')},
    pioneer: { obj: null, div: null},
    terre: { obj: null, div: null, description: null, distance: 150, passed: false, x: 0, y: 0 },
    mars: { obj: null, div: null, description: null, distance: 300000000, passed: false, x: 60, y: 0 },
    jupiter: { obj: null, div: null, description: null, distance: 591000000, passed: false, x: 170, y: -50 },
};

let angle = 0;
const rayonOrbite = 3; // Distance du satellite à la planète
const vitesseOrbitale = 0.01; // Vitesse de l'orbite

const positionPlaneteAvant = { x: -50, y: 0, z: -25 }; // Position de la planète
const positionPlanete = { x: 4, y: 0, z: -5 }; // Position de la planète
const positionPlaneteApres = { x: 8, y: 0, z: 0 }; // Position de la planète

const positionTabletteVisible = { x: 0, y: 0, z: -0.5 };
const positionTabletteInvisible = { x: 0, y: 1, z: -0.5 };

const compteur = document.getElementById('valeur');


///
//CHARGEMENT OBJET 3D
///
let loader = new GLTFLoader();
loader.load( './public/Pioneer_1.20.glb', function ( gltf ) {
    scene.add( gltf.scene );
    my3DObject = gltf.scene;
    my3DObject.scale.set(4.5, 4.5, 4.5);  
    my3DObject.position.y = positionTabletteInvisible.y;
    my3DObject.position.x = positionTabletteInvisible.x;
    my3DObject.position.z = positionTabletteInvisible.z;
    my3DObject.rotation.set(1.65, 0, 0);
    planetes.pioneer.obj = my3DObject;
    planetes.pioneer.div = document.getElementById('intro');
}, undefined, function ( error ) {
    console.error( error );
} );

loader.load( './public/Petite_terre.glb', function ( gltf ) {
    scene.add( gltf.scene );
    deuxiemeObject = gltf.scene;
    deuxiemeObject.scale.set(2.15, 2.15, 2.15);
    deuxiemeObject.position.x = positionPlaneteAvant.x;
    deuxiemeObject.position.z = positionPlaneteAvant.z;
    deuxiemeObject.rotation.x = 2;
    planetes.terre.obj = deuxiemeObject;
    planetes.terre.div = document.getElementById('div-terre');
    planetes.terre.description = document.getElementById('informationTerre');
}, undefined, function(error){
    console.error(error);
});

loader.load( './public/Mars.glb', function ( gltf ) {
    scene.add( gltf.scene );
    mars = gltf.scene;
    mars.scale.set(1, 1, 1);
    mars.position.x = positionPlaneteAvant.x;
    mars.position.z = positionPlaneteAvant.y;
    planetes.mars.obj = mars;
    planetes.mars.div = document.getElementById('div-mars');
    planetes.mars.description = document.getElementById('informationMars');
});

loader.load( './public/Jupiter.glb', function ( gltf ) {
    scene.add( gltf.scene );
    jupiter = gltf.scene;
    jupiter.scale.set(1, 1, 1);
    jupiter.position.x = positionPlaneteAvant.x;
    jupiter.position.z = positionPlaneteAvant.y;
    planetes.jupiter.obj = jupiter;
    planetes.jupiter.div = document.getElementById('div-jupiter');
    planetes.jupiter.description = document.getElementById('informationJupiter');
});

const ObjectLoader = new OBJLoader();
ObjectLoader.load('./public/Satellite.obj', function (object) {
    scene.add(object);
    troisiemeObject = object;
    troisiemeObject.scale.set(0.15, 0.15, 0.15);
    troisiemeObject.position.y = 0;
    troisiemeObject.position.x = 4;
    troisiemeObject.position.z = -5;
}, undefined, function (error) {
    console.error(error);
});


///
//Zone cliquable tablette pioneer
///

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); 



let zoneCliquableHumain = new THREE.Mesh(geometry, material);
zoneCliquableHumain.visible = false; // Rend l'objet invisible
scene.add(zoneCliquableHumain);
zoneCliquableHumain.position.x = 0.2;
zoneCliquableHumain.position.y = 0.1;
zoneCliquableHumain.position.z = -0.5;
zoneCliquableHumain.scale.set(0.1, 0.1, 0.1);

let zoneCliquableAtome = new THREE.Mesh(geometry, material);
zoneCliquableAtome.visible = false; // Rend l'objet invisible
scene.add(zoneCliquableAtome);
zoneCliquableAtome.position.x = -0.2;
zoneCliquableAtome.position.y = 0.27;
zoneCliquableAtome.position.z = -0.5;
zoneCliquableAtome.scale.set(0.1, 0.1, 0.1);

let zoneCliquablePulsar = new THREE.Mesh(geometry, material);   
zoneCliquablePulsar.visible = false; // Rend l'objet invisible
scene.add(zoneCliquablePulsar);
zoneCliquablePulsar.position.x = -0.2;
zoneCliquablePulsar.position.y = 0;
zoneCliquablePulsar.position.z = -0.5;
zoneCliquablePulsar.scale.set(0.1, 0.1, 0.1);

let zoneCliquableMap = new THREE.Mesh(geometry, material);
zoneCliquableMap.visible = false; // Rend l'objet invisible
scene.add(zoneCliquableMap);
zoneCliquableMap.position.x = 0;
zoneCliquableMap.position.y = -0.24;
zoneCliquableMap.position.z = -0.5;
zoneCliquableMap.scale.set(0.075, 0.075, 0.075);





const light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(1, 1, 1);
scene.add(light);

renderer.setClearColor(0xAAAAAA , 0);


///
//SCROLL
///

let lastScroll = 0;
let currentScroll = 0;
document.addEventListener('scroll', onScrollDiv, false);

function onScrollDiv() {
    currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    for (let key in planetes) {
        const planete = planetes[key];
        const rect = planete.div.getBoundingClientRect();
        const isVisible = rect.top < 0 && rect.bottom > 0;
        animerPlanete(planete, isVisible);
    }
    lastScroll = currentScroll <= 0 ? 0 : currentScroll;;

}

function animerPlanete(planete, isVisible) {
    if(!planete) return;
    if(planete.div.id == 'intro1' || planete.div.id == 'intro2' || planete.div.id == 'intro3'){
        if(isVisible){
            gsap.to(planete.element,{
                duration: 1,
                opacity: 1,
                display: 'block',
                ease: "power1.out"
            });

        }else{
            gsap.to(planete.element,{
                duration: 1,
                opacity: 0,
                display: 'none',
                ease: "power1.out"
            });
        }
    }
    if(planete.div.id == 'intro'){
        if(isVisible){
            gsap.to(planete.obj.position, {
                duration: 1, 
                x: positionTabletteVisible.x, 
                y: positionTabletteVisible.y, 
                z: positionTabletteVisible.z, 
                ease: "power1.out"
            });
            gsap.to('.cercle',{
                duration: 0.1,
                opacity: 1,
                display:'block',
                ease: "power1.out"
            });
            gsap.to('.mapContainer', {
                duration: 1,
                opacity: 0,
                display: 'none',
                ease: "power1.out"
            });
            gsap.to('.compteur', {
                duration: 1,
                opacity: 0,
                display: 'none',
                ease: "power1.out"
            });
        }else{
            gsap.to(planete.obj.position, {
                duration: 1, 
                x: positionTabletteInvisible.x, 
                y: positionTabletteInvisible.y, 
                z: positionTabletteInvisible.z, 
                ease: "power1.out"
            });
        }        
    }else{
        if(isVisible && !planete.passed){
            gsap.to('.mapContainer', {
                duration: 1,
                opacity: 1,
                display: 'flex',
                ease: "power1.out"
            });
            gsap.to('.compteur', {
                duration: 1,
                opacity: 1,
                display: 'block',
                ease: "power1.out"
            });
            planete.passed = true;
            gsap.to(planete.obj.position, {
                duration: 1, 
                x: positionPlanete.x, 
                y: positionPlanete.y, 
                z: positionPlanete.z, 
                ease: "power1.out"
            });
            gsap.to(planete.description,{
                left:'30%'
            });
            gsap.to('.information', {
                duration: 0.5,
                opacity: 0,
                display: 'none',
                ease: "power1.out"
            });
            gsap.to('.cercle',{
                duration: 0.1,
                opacity: 0,
                display:'none',
                ease: "power1.out"
            });
            gsap.to('.sonde',{
                duration: 1,
                x: planete.x,
                y: planete.y,
                ease: "power1.out"
            });
            animerValeurCompteur(parseInt(compteur.innerText), planete.distance, 1500);
        }else if(!isVisible){
            if(currentScroll > lastScroll && planete.passed){
                planete.passed = false;
                gsap.to(planete.obj.position, {
                    duration: 1, 
                    x: positionPlaneteApres.x, 
                    y: positionPlaneteApres.y, 
                    z: positionPlaneteApres.z, 
                    ease: "power1.out"
                });
            }else if(currentScroll < lastScroll && !planete.passed){
                gsap.to(planete.obj.position, {
                    duration: 1, 
                    x: positionPlaneteAvant.x, 
                    y: positionPlaneteAvant.y, 
                    z: positionPlaneteAvant.z, 
                    ease: "power1.out"
                });
            }
            gsap.to(planete.description,{
                left:'-50%'
            });
        }
    }
}

function animerValeurCompteur(debut, fin, duree) {
    let start = null;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        let valeurActuelle;

        if (debut < fin) {
            valeurActuelle = Math.min(debut + progress / duree * (fin - debut), fin);
        } else {
            valeurActuelle = Math.max(debut - progress / duree * (debut - fin), fin);
        }

        compteur.textContent = Math.floor(valeurActuelle);

        if ((debut < fin && valeurActuelle < fin) || (debut > fin && valeurActuelle > fin)) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}



///
//tablette interaction
///

let isDetail = false;

window.addEventListener('click', retourEtatInitialPlaque, false);

let cercles = document.querySelectorAll('.cercle');
cercles.forEach(cercle => {
    cercle.addEventListener('click', function(){
        event.stopPropagation();
        if(isDetail) return;
        handleZoneClick(cercle);
    })
});


function handleZoneClick(cercle) {
    console.log(isDetail);
    gsap.to('.cercle',{
        duration: 0.1,
        opacity: 0,
        display:'none',
        ease: "power1.out"
    });

    if(cercle.id === 'humain'){
        isDetail = true;
        gsap.to(my3DObject.position, {
            duration: 1, 
            x: -0.1, 
            y: 0, 
            ease: "power1.out"
        });
        gsap.to(my3DObject.scale, {
            duration: 1, 
            x: 5.5, 
            y: 5.5,
            z:5.5, 
            ease: "power1.out"
        });
        gsap.to('.informationHumain',{
            duration: 0.5,
            opacity: 1,
            display: 'block',
            ease: "power1.out"
        });
    }
    if(cercle.id === 'atome'){
        isDetail = true;
        gsap.to(my3DObject.position, {
            duration: 1, 
            x: 0.5, 
            y: -0.3, 
            ease: "power1.out"
        });
        gsap.to(my3DObject.scale, {
            duration: 1, 
            x: 6.5, 
            y: 6.5,
            z:6.5, 
            ease: "power1.out"
        });
        gsap.to('.informationAtome',{
            duration: 0.5,
            opacity: 1,
            display: 'block',
            ease: "power1.out"
        });
    }
    if(cercle.id === 'pulsar'){
        isDetail = true;
        gsap.to(my3DObject.position, {
            duration: 1, 
            x: 0.4, 
            y: 0, 
            ease: "power1.out"
        });
        gsap.to(my3DObject.scale, {
            duration: 1, 
            x: 5.5, 
            y: 5.5,
            z:5.5, 
            ease: "power1.out"
        });
        gsap.to('.informationPulsar',{
            duration: 0.5,
            opacity: 1,
            display: 'block',
            ease: "power1.out"
        });
    }
    if(cercle.id === 'mapCircle'){
        isDetail = true;
        gsap.to(my3DObject.position, {
            duration: 1, 
            x: 0, 
            y: 0.5, 
            ease: "power1.out"
        });
        gsap.to(my3DObject.scale, {
            duration: 1, 
            x: 5.5, 
            y: 5.5,
            z:5.5, 
            ease: "power1.out"
        });
        gsap.to('.informationMap',{
            duration: 0.5,
            opacity: 1,
            display: 'block',
            ease: "power1.out"
        });
    }
}

function retourEtatInitialPlaque(){
    if(!isDetail) return;
    isDetail = false;
    gsap.to(my3DObject.position, {
        duration: 1,
        x: positionTabletteVisible.x,
        y: positionTabletteVisible.y,
        z: positionTabletteVisible.z,
        ease: "power1.out" 
    });
    gsap.to(my3DObject.scale, {
        duration: 1, 
        x: 4.5, 
        y: 4.5,
        z:4.5, 
        ease: "power1.out"
    });
    gsap.to('.information',{
        duration: 0.5,
        opacity: 0,
        display: 'none',
        ease: "power1.out"
    });
    gsap.to('.cercle',{
        duration: 0.5,
        opacity: 1,
        display:'block',
        ease: "power1.out"
    });
}







///
//ANIMATION
///
function animate() {
	requestAnimationFrame( animate );

    //fait tourner la planete
    if(deuxiemeObject){
        deuxiemeObject.rotation.y += 0.005;
    }

    // Mettre à jour l'angle pour créer un mouvement orbital
    angle += vitesseOrbitale;

    // Mettre à jour la position du satellite
    troisiemeObject.position.x = positionPlanete.x - rayonOrbite * Math.cos(angle);
    troisiemeObject.position.z = positionPlanete.z - rayonOrbite * Math.sin(angle);
    //look at positionPlanete
    troisiemeObject.lookAt(positionPlanete.x, positionPlanete.y, positionPlanete.z);

	renderer.render( scene, camera );
}


///
//FONCTIONNEMENT MAP 
///
let SVG = document.getElementById('map');
let clickableElement = SVG.querySelectorAll('.clickableElement'); // Remplacez par l'ID de l'élément SVG

clickableElement.forEach(element => {
    element.addEventListener('click', function(){
        console.log(element.id);
        let id = element.id.split('_')[1];
        gsap.to(".sonde", {
            duration: 1, 
            x: pointsDArret[id].x, 
            y: pointsDArret[id].y, 
            ease: "power1.out"
        });
    })
});

animate();