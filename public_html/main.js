import {OBJLoader} from './resources/threejs/r122/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from './resources/threejs/r122/examples/jsm/loaders/MTLLoader.js';
import {DDSLoader} from './resources/threejs/r122/examples/jsm/loaders/DDSLoader.js';

var container, scene, camera, renderer;

var controls;

var sphere, player;

const objects = [];

var player = new THREE.Object3D();

const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();

init();
update();

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
        const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
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
        objLoaderExample.load('obj/character/character.obj',(root) => {
        root.rotation.y = Math.PI * -1;
        player.add(root);
     //scene.add(root);
     });
    });
	
    loadApartment(10,10,1,1);
    loadApartment(10,30,1,2);
    loadApartment(10,50,1,3);
    loadApartment(30,30,1,4);
    loadApartment(50,50,2,15);
   
   
   objectLoader('obj/trash/bottle1.mtl', 'obj/trash/bottle1.obj', 0, 5);
   objectLoader('obj/trash/bottle2.mtl', 'obj/trash/bottle2.obj', -5, 5);
   objectLoader('obj/trash/bottle3.mtl', 'obj/trash/bottle3.obj', -10, 5);
   
   objectLoader('obj/trash/trash_bag.mtl', 'obj/trash/trash_bag.obj', 0, 10);
   objectLoader('obj/trash/trash_can.mtl', 'obj/trash/trash_can.obj', -5, 10);
   objectLoader('obj/trash/trash_can_wlid.mtl', 'obj/trash/trash_can_wlid.obj', -10, 10);
   
   objectLoader('obj/trash/trash_dumpster.mtl', 'obj/trash/trash_dumpster.obj', 0, 15, 0, true);
   objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -5, 15, 0, true);
   objectLoader('obj/character/character.mtl', 'obj/character/character.obj', -10, 15, 0, true);


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
    //player.rotation.y += Math.PI * 0.5;
    scene.add(player);

    controls = new THREE.PlayerControls(camera, player);
    controls.init();

    // Events
    controls.addEventListener('change', render, false);
    window.addEventListener('resize', onWindowResize, false);

    // Final touches
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
    
    

}

function update() {

    controls.update();

    render();
    requestAnimationFrame(update);
}

function render() {
    // Render Scene
    renderer.clear();
    renderer.render(scene, camera);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function loadApartment(x=0, z=0, type = 1, floor = 1, y = 0.0){
    
    type = type.toString();
    
    objectLoader('obj/apartment/'+type+'/bot.mtl', 'obj/apartment/'+type+'/bot.obj', x, z, y + 0);
    
    var i = 1;
    for (; i < floor; i++)
        objectLoader('obj/apartment/'+type+'/mid.mtl', 'obj/apartment/'+type+'/mid.obj', x, z, y + 3.417 * i);
    
    objectLoader('obj/apartment/'+type+'/top.mtl', 'obj/apartment/'+type+'/top.obj', x, z, y + 3.417 * floor);

    }



function objectLoader(mtlUrl, objUrl, x, z, y = 0.0, draggable = false, rotation = -1){
    
    //if we wanna use obj outside and they aren't static, we can add it to a list or smth.
    
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlUrl, function (materials) {
    materials.preload();
    const objLoaderExample = new OBJLoader();
    objLoaderExample.setMaterials(materials);
    objLoaderExample.load(objUrl,(root) => {
            
            root.rotation.y = Math.PI * rotation;
            
            root.position.x = x;
            root.position.y = y;
            root.position.z = z;
           
            if (draggable)
                objects.push(root);
            
            scene.add(root);
        });
    }); 
    
}