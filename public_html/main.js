import {OBJLoader} from './resources/threejs/r122/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from './resources/threejs/r122/examples/jsm/loaders/MTLLoader.js';
import {DDSLoader} from './resources/threejs/r122/examples/jsm/loaders/DDSLoader.js';


var container, scene, camera, renderer;

var controls;

var sphere;
var control_target = new THREE.Object3D();
var player = new THREE.Object3D();
var truck = new THREE.Object3D();
var control_target = player;

init();
animate();

function init() {

    // Setup
    container = document.getElementById('container');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);

    renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    //
    {
        const planeSize = 2000;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('ground.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 8;
        texture.repeat.set(repeats, repeats);

        const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
    }

    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }

    //
    // Add Objects To the Scene HERE


    const mtlLoader = new MTLLoader();
    mtlLoader.load('obj/character/character.mtl', function (materials) {
        materials.preload();
        
        const objLoaderExample = new OBJLoader();
        objLoaderExample.setMaterials(materials);
        objLoaderExample.load('obj/character/character.obj',
                (root) => {
                    root.rotation.y = Math.PI * -1;
                    player.add(root);
                });
    });
    
    const objLoader = new OBJLoader();
    objLoader.load('obj/vehicle/truck.obj', (root) => {
        root.rotation.y = Math.PI * -1;
        truck.add(root);
    });

    // loading only character object without its material
    /*
     const objLoader = new OBJLoader();
     objLoader.load('obj/character/character.obj', (root) => {
     root.scale.set(2, 2, 2);
     root.rotation.y = Math.PI * -1;
     player.add(root);
     //scene.add(root);
     });
     */
    //
    player.position.x = 0;
    //player.rotation.y += Math.PI * -1;
    scene.add(player);
    scene.add(truck);
    //controls = new THREE.PlayerControls(camera, player);
    controls = new THREE.PlayerControls(camera, control_target);
    controls.init();

    // Events
    controls.addEventListener('change', render, false);
    window.addEventListener('resize', onWindowResize, false);

    // Final touches
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    
    render();
}

function render() {
    // Render Scene
    renderer.clear();
    controls = new THREE.PlayerControls(camera, control_target);
    controls.init();
    renderer.render(scene, camera);
    
    
    
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 70) {
        if(control_target == player){
            control_target = truck;
            console.log(control_target);
        }  
        else
            control_target = player;
    }
    }, true);
    