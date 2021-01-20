import {OBJLoader} from './resources/threejs/r122/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from './resources/threejs/r122/examples/jsm/loaders/MTLLoader.js';
import {DDSLoader} from './resources/threejs/r122/examples/jsm/loaders/DDSLoader.js';
import {DragControls} from './resources/threejs/r122/examples/jsm/controls/DragControls.js';

var container, scene, camera, renderer;

var controls;
var drag_controls;
var group;

var sphere;
let enableSelection = false;
const objects = [];
const collidableObjects = [];
var collected = [];
var trash = [];
var player = new THREE.Object3D();
var truck = new THREE.Object3D();

var spotLightPlayer;
var spotLight;

truck.name = "truck";
player.name = "player";
const mouse = new THREE.Vector2(), raycaster = new THREE.Raycaster();
var control_target;
init();
animate();

function init() {

    // Setup
    container = document.getElementById('container');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
	//cem karaca
    const listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    const nostalgia = ['cem_karaca_isci_kal.mp3', 'baris_manco_donence.mp3'];
    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( nostalgia[randomInt(0,1)], function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.1 );
            sound.play();
    });

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
        light.name = "hemisphereLight";
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(0, 10, 0);
        light.target.position.set(-5, 0, 0);
        light.name = "directionalLight"
        scene.add(light);
        scene.add(light.target);
    }

    //
    // Add Objects To the Scene HERE


    const mtlLoader = new MTLLoader();
    // adding player to scene
    mtlLoader.load('obj/character/character.mtl', function (materials) {
        materials.preload();
        const objLoaderExample = new OBJLoader();
        objLoaderExample.setMaterials(materials);
        objLoaderExample.load('obj/character/character.obj', (root) => {
            root.rotation.y = Math.PI * -1;
            player.add(root);
            //scene.add(root);
        });
    });
    // adding truck to scene
    
    mtlLoader.load('obj/vehicle/truck.mtl', function (materials) {
        materials.preload();
        const objLoaderExample = new OBJLoader();
        objLoaderExample.setMaterials(materials);
        objLoaderExample.load('obj/vehicle/truck.obj', (root) => {
            root.rotation.y = Math.PI * -1;
            
            //root.position.x = -10;
            //root.position.y = 0;
            //root.position.z = 5;
            //collidableObjects.push(root);
            //objects.push(root);

            truck.add(root);
            //scene.add(root);
        });
    });
    

	/***************************************************************************/

    loadApartment(15, 15, 1, Math.floor(Math.random() * 10)+1);
    loadApartment(27.5, 15, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(27.5, 25, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(52.5, 15, 1, Math.floor(Math.random() * 10)+1, -0.5);
    loadApartment(52.5, 25, 1, Math.floor(Math.random() * 10)+1, -0.5);
    loadApartment(52.5, 35, 1, Math.floor(Math.random() * 10)+1, -0.5);
    loadApartment(40, 45, 2, Math.floor(Math.random() * 20)+1);
    
    loadApartment(-15, 10, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-15, 20, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-15, 30, 1, Math.floor(Math.random() * 10)+1, 0.5);

    /*
    objectLoader('obj/trash/bottle1.mtl', 'obj/trash/bottle1.obj', 0, 5, 0, true);
    objectLoader('obj/trash/bottle2.mtl', 'obj/trash/bottle2.obj', -5, 5, 0, true);
    objectLoader('obj/trash/bottle3.mtl', 'obj/trash/bottle3.obj', -10, 5, 0, true);

    objectLoader('obj/trash/trash_bag.mtl', 'obj/trash/trash_bag.obj', 0, 10, 0, true);
    objectLoader('obj/trash/trash_can.mtl', 'obj/trash/trash_can.obj', -5, 10, 0, true);
    objectLoader('obj/trash/trash_can_wlid.mtl', 'obj/trash/trash_can_wlid.obj', -10, 10, 0, true);

    objectLoader('obj/trash/trash_dumpster.mtl', 'obj/trash/trash_dumpster.obj', 0, 15, 0, );
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -5, 15, 0);
    objectLoader('obj/character/character.mtl', 'obj/character/character.obj', -10, 15, 0, true);

    objectLoader('obj/vehicle/truck.mtl', 'obj/vehicle/truck.obj', 0, 0, 0, false);
    objectLoader('obj/vehicle/truck.mtl', 'obj/vehicle/truck.obj', -20, 15, 0, true);*/


    objectLoader('obj/trash/trash_can.mtl', 'obj/trash/trash_can.obj', 7, 7, 0, false);
    
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -7, 15, 0, false, 0.5);
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -7, 55, 0, false, 0.75);
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -7, -20, 0, false, 0.5);
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -7, -50, 0, false, 0.5);
    
    
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', 30, 7, 0, false, -1);
    
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -40, 7, 0, false, -1);
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -70, 7, 0, false, -1);
    
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -30, -67.5, 0, false, 0);
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -65, -67.5, 0, false, 0);
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', 30, -67.5, 0, false, 0);
    
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', 80, 7, 0, false, -1);
    
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', 30, 45, 0, false, -1);
    
    
    
    
    
    objectLoader('obj/way/connector.mtl', 'obj/way/connector.obj', 0, 0, 0.01, false, 0);
    
    // 0.5 way
    for (var i = 1; i <= 3; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 10 * i, 0, 0.01, false, 0.5);
    
    objectLoader('obj/way/connector.mtl', 'obj/way/connector.obj', 40, 0, 0.01, false, 0);
    for (var i = 1; i <= 3; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 40 + 10 * i, 0, 0.01, false, 0.5);
    // 0 turn at 0.5 way
    for (var i = 1; i <= 2; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 40, 10 * i, 0.01, false, 0);
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', 40, 30, 0.01, false, 0);
    // end of 0.5 way
    for (var i = 1; i <= 3; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 40 + 10 * i, 0, 0.01, false, 0.5);
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', 80, 0, 0.01, false, 0.5);
    loadApartment(95, 0, 2, 9, -0.5);
    loadApartment(65, 15, 1, 2, -1);
    
    for (var i = 1; i <= 7; i++)
        loadApartment(85 - 10*i, -15, 1, Math.floor(Math.random() * 10), 0);
    
    for (var i = 1; i <= 2; i++)
        loadApartment(-15 -15*i, 15, 1, Math.floor(Math.random() * 10), -1);
    
    loadApartment(-15, -15, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-15, -25, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-15, -35, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-15, -45, 1, Math.floor(Math.random() * 10)+1, 0.5);
    
    loadApartment(15, -25, 1, Math.floor(Math.random() * 10)+1, -0.5);
    loadApartment(15, -35, 1, Math.floor(Math.random() * 10)+1, -0.5);
    loadApartment(15, -45, 1, Math.floor(Math.random() * 10)+1, -0.5);
    
    loadApartment(-25, -45, 1, Math.floor(Math.random() * 10)+1, -1);
    loadApartment(-35, -45, 1, Math.floor(Math.random() * 10)+1, -1);
    loadApartment(-25, -75, 1, Math.floor(Math.random() * 10)+1, 1);
    loadApartment(-35, -75, 1, Math.floor(Math.random() * 10)+1, 1);
    loadApartment(-15, -75, 1, Math.floor(Math.random() * 10)+1, 1);
    loadApartment(-45, -75, 1, Math.floor(Math.random() * 10)+1, 1);
    
    loadApartment(-45, -25, 1, Math.floor(Math.random() * 10)+1, -0.5);
    loadApartment(-45, -35, 1, Math.floor(Math.random() * 10)+1, -0.5);
    loadApartment(-75, -25, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-75, -35, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-75, -15, 1, Math.floor(Math.random() * 10)+1, 0.5);
    loadApartment(-75, -45, 1, Math.floor(Math.random() * 10)+1, 0.5);
    
    
    loadApartment(-45, 30, 1, Math.floor(Math.random() * 10)+1, -0.75);
    loadApartment(-60, 35, 1, Math.floor(Math.random() * 10)+1, -1);
    loadApartment(-75, 30, 1, Math.floor(Math.random() * 10)+1, 0.75);
    
    loadApartment(-75, 15, 1, Math.floor(Math.random() * 10)+1, 0.5);
    
    loadApartment(-25, -15, 1, Math.floor(Math.random() * 10)+1, 0);
    loadApartment(-35, -15, 1, Math.floor(Math.random() * 10)+1, 0);
    
    loadApartment(70, 15, 1, Math.floor(Math.random() * 10)+1, -1);
    
    loadApartment(40, -75, 2, Math.floor(Math.random() * 10)+1, 0);
    loadApartment(-75, -65, 2, Math.floor(Math.random() * 10)+1, 0.5);
    
    loadApartment(25, -75, 1, Math.floor(Math.random() * 10)+1, 0);
    loadApartment(30, -45, 1, Math.floor(Math.random() * 10)+1, -1);
    loadApartment(40, -45, 1, Math.floor(Math.random() * 10)+1, -1);
    
    // -1 way
    for (var i = 1; i <= 5; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 0, -10*i, 0.01, false, -1);
   
    objectLoader('obj/way/connector.mtl', 'obj/way/connector.obj', 0, -60, 0.01, false, -1);
    for (var i = 1; i <= 10; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 0, -60-10*i, 0.01, false, -1);
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', 0, -170, 0.01, false, -1);
    for (var i = 1; i <= 3; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 10*i, -60, 0.01, false, 0.5);
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', 40, -60, 0.01, false, 0.5);
    for (var i = 1; i <= 5; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', -10*i, -60, 0.01, false, -0.5);
    
    
    objectLoader('obj/way/connector.mtl', 'obj/way/connector.obj', -60, -60, 0.01, false, 0);
    for (var i = 1; i <= 5; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', -60, -60+10*i, 0.01, false, 0);
    
    objectLoader('obj/way/connector.mtl', 'obj/way/connector.obj', -60, 0, 0.01, false, 0);
    objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', -60, 10, 0.01, false, 0);
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', -60, 20, 0.01, false, 0);
    for (var i = 1; i <= 5; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', -60+10*i, 0, 0.01, false, 0.5);
    for (var i = 1; i <= 10; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', -60-10*i, 0, 0.01, false, -0.5);
    
    
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', -170, 0, 0.01, false, -0.5);
    
    
    // 0 way
    for (var i = 1; i <= 3; i++)
        objectLoader('obj/way/mid.mtl', 'obj/way/mid.obj', 0, 10*i, 0.01, false, 0);
    
    
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', 10, 40, 0.01, false, 0.5);
    objectLoader('obj/way/connector.mtl', 'obj/way/connector.obj', 0, 40, 0.01, false, 0);
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', 0, 50, 0.01, false, 0);
    loadApartment(15, 55, 1, Math.floor(Math.random() * 10)+1, -0.75);
    loadApartment(0, 65, 1, Math.floor(Math.random() * 10)+1, -1);
    loadApartment(-15, 55, 1, Math.floor(Math.random() * 10)+1, 0.75);
    objectLoader('obj/way/end.mtl', 'obj/way/end.obj', -10, 40, 0.01, false, -0.5);
    loadApartment(-25, 40, 1, Math.floor(Math.random() * 10)+1, 0.5);
    
    
    
    
    for (var i = -170; i <= -100; i= i + 2)
        objectLoader('obj/field/plant.mtl', 'obj/field/plant.obj', i, 15, 0, false, Math.random() * 2 - 1);
    for (var i = -170; i <= -100; i= i + 2)
        objectLoader('obj/field/plant.mtl', 'obj/field/plant.obj', i, 20, 0, false, Math.random() * 2 - 1);
    for (var i = -170; i <= -100; i= i + 2)
        objectLoader('obj/field/plant.mtl', 'obj/field/plant.obj', i, 25, 0, false, Math.random() * 2 - 1);
    for (var i = -170; i <= -100; i= i + 2)
        objectLoader('obj/field/plant.mtl', 'obj/field/plant.obj', i, 30, 0, false, Math.random() * 2 - 1);
    
    for (var i = -170; i < -100; i= i + 6.25)
        objectLoader('obj/field/fence.mtl', 'obj/field/fence.obj', i, 10, 0, false, 0);
    for (var i = -170; i < -100; i= i + 6.25)
        objectLoader('obj/field/fence.mtl', 'obj/field/fence.obj', i, 35, 0, false, 0);
    
    for (var i = 10; i < 35; i= i + 6.25)
        objectLoader('obj/field/fence.mtl', 'obj/field/fence.obj', -176.25, i, 0, false, 0.5);
    for (var i = 10; i < 35; i= i + 6.25)
        objectLoader('obj/field/fence.mtl', 'obj/field/fence.obj', -101.25, i, 0, false, 0.5);
    
    
    for (var i = 0; i < 30; i++)
        objectLoader('obj/field/cow.mtl', 'obj/field/cow.obj', randomInt(-190, -100), randomInt(-15, -50), 0, false, Math.random() * 2 - 1);
    
    
    
    
    
    
    
    
    
    for (var i = 0; i < 300; i++){
        var type = Math.floor(Math.random() * 3)+1;
        objectLoader('obj/tree/'+type+'.mtl', 'obj/tree/'+type+'.obj', randomInt(-200, 150), randomInt(75, 200), 0.1, false, Math.random() * 2 - 1);
    }    
    
    for (var i = 0; i < 150; i++){
        var type = Math.floor(Math.random() * 3)+1;
        objectLoader('obj/tree/'+type+'.mtl', 'obj/tree/'+type+'.obj', randomInt(105, 150), randomInt(-200, 75), 0.1, false, Math.random() * 2 - 1);
    }
    
    for (var i = 0; i < 250; i++){
        var type = Math.floor(Math.random() * 3)+1;
        objectLoader('obj/tree/'+type+'.mtl', 'obj/tree/'+type+'.obj', randomInt(-200, 150), randomInt(-325, -200), 0.1, false, Math.random() * 2 - 1);
    }
    
    for (var i = 0; i < 200; i++){
        var type = Math.floor(Math.random() * 3)+1;
        objectLoader('obj/tree/'+type+'.mtl', 'obj/tree/'+type+'.obj', randomInt(-245, -200), randomInt(-325, 200), 0.1, false, Math.random() * 2 - 1);
    }
    
    
    objectLoader('obj/farm.mtl', 'obj/farm.obj', -180, 0, 0.01, false, 0);
    objectLoader('obj/factory.mtl', 'obj/factory.obj', 0, -190, 0.01, false, -0.5);

	
	
	
	
	
	
	
	/************************************************************************/

    objectLoader('obj/trash/bottle1.mtl', 'obj/trash/bottle1.obj', 0, 5, 0, true);
    objectLoader('obj/trash/bottle2.mtl', 'obj/trash/bottle2.obj', -5, 5, 0, true);
    objectLoader('obj/trash/bottle3.mtl', 'obj/trash/bottle3.obj', -10, 5, 0, true);

    objectLoader('obj/trash/trash_bag.mtl', 'obj/trash/trash_bag.obj', 0, 10, 0, true);
    objectLoader('obj/trash/trash_can.mtl', 'obj/trash/trash_can.obj', -5, 10, 0, true);
    objectLoader('obj/trash/trash_can_wlid.mtl', 'obj/trash/trash_can_wlid.obj', -10, 10, 0, true);

    objectLoader('obj/trash/trash_dumpster.mtl', 'obj/trash/trash_dumpster.obj', 0, 15, 0, );
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -5, 15, 0);
    //objectLoader('obj/character/character.mtl', 'obj/character/character.obj', -10, 15, 0, true);

    //objectLoader('obj/vehicle/truck.mtl', 'obj/vehicle/truck.obj', -20, 15, 0, true);
	
	
	
    
    // spotlight
    {
        spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(player.position.x, player.position.y, player.position.z);
        spotLight.angle = Math.PI / 30;
        spotLight.penumbra = 0.1;
        spotLight.decay = 2;
        spotLight.distance = 200;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 50;
        spotLight.shadow.mapSize.height = 50;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.focus = 2;
        scene.add(spotLight);
        
        const targetObject = spotLightPlayer;
        scene.add(targetObject);
        
        spotLight.target = targetObject;
    }
    
    player.position.x = 0;
    //objectLoader('obj/vehicle/truck.mtl', 'obj/vehicle/truck.obj', -20, 15, 0, false);


    //
    //player.position.x = 0;
    //player.rotation.y += Math.PI * 0.5;
    truck.position.x = -10;
    scene.add(player);
    scene.add(truck);
    control_target = player;
    controls = new THREE.PlayerControls(camera, player, collidableObjects, raycaster);
    controls.init();

    group = new THREE.Group();
    scene.add(group);

    drag_controls = new DragControls(objects, camera, renderer.domElement);
    drag_controls.addEventListener('drag', render);

    // Events
    controls.addEventListener('change', render, false);
    window.addEventListener('resize', onWindowResize, false);
    
    // Final touches
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);


}

function update() {
    //raycaster.set(player.position, new THREE.Vector3(0, 0, 1));
    //console.log(player.position);
    //const intersects = raycaster.intersectObjects(scene.children, true);
   
    
    
    
    
    /*if(intersects.length > 0){
        for(let i = 0; i< intersects.length; i++){
            if(intersects[i].distance < 0.5){
                console.log("we hit something");
                break;
            }
            else{
                //console.log("object is far away")
            };
        }
        
        //intersects[0].object.material.color.set( 0xff0000 );

    }
    else{
        console.log("no collision")
    }*/

    //console.log(intersects.length);

    let directionalLight = scene.getObjectByName("directionalLight");
    let hemisphereLight = scene.getObjectByName("hemisphereLight");
    directionalLight.intensity = GLOBAL_SERVICE_PROVIDER.lightingIntensity;
    hemisphereLight.intensity = GLOBAL_SERVICE_PROVIDER.lightingIntensity;

    pickTrash();
    controls.update();
    // Drag Control
    document.addEventListener('oncontextmenu', onClick, false);
    //document.addEventListener('onmouseup', onRelease, false);


}

function animate() {
    //raycaster.set(player.position, new THREE.Vector3(0, 0, 1));
    //console.log(player.position);
    //const intersects = raycaster.intersectObjects(scene.children, true);





    /*if(intersects.length > 0){
     for(let i = 0; i< intersects.length; i++){
     if(intersects[i].distance < 0.5){
     console.log("we hit something");
     break;
     }
     else{
     //console.log("object is far away")
     };
     }
     
     //intersects[0].object.material.color.set( 0xff0000 );
     }
     else{
     console.log("no collision")
     }*/

    //console.log(intersects.length);
    //controls.update();
    requestAnimationFrame(animate);
    render();
    requestAnimationFrame(update);

}

function render() {
    // Render Scene
    /*
     if ( drag_controls.enabled )
     controls.enabled = false;
     else
     controls.enabled = true;
     
     */
    spotLight.position.set(player.position.x, player.position.y + 30, player.position.z);
    spotLight.target = player;
    camera.lookAt(control_target);
/*     console.log("player : ", player.position.x, player.position.y, player.position.z);
    console.log("truck  : ", truck.position.x, truck.position.y, player.position.z);
    console.log("target : ", control_target.name); */
    renderer.clear();
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function loadApartment(x = 0.0, z = 0.0, type = 1, floor = 1, rot=-1.0, y = 0.0) {

    type = type.toString();

    objectLoader('obj/apartment/' + type + '/bot.mtl', 'obj/apartment/' + type + '/bot.obj', x, z, y + 0, false, rot);

    var i = 1;
    for (; i < floor; i++)
        objectLoader('obj/apartment/' + type + '/mid.mtl', 'obj/apartment/' + type + '/mid.obj', x, z, y + 3.417 * i, false, rot);

    objectLoader('obj/apartment/' + type + '/top.mtl', 'obj/apartment/' + type + '/top.obj', x, z, y + 3.417 * floor, false, rot);

}



function objectLoader(mtlUrl, objUrl, x, z, y = 0.0, draggable = false, rotation = - 1) {

    //if we wanna use obj outside and they aren't static, we can add it to a list or smth.

    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlUrl, function (materials) {
        materials.preload();
        const objLoaderExample = new OBJLoader();
        objLoaderExample.setMaterials(materials);
        objLoaderExample.load(objUrl, (root) => {

            root.rotation.y = Math.PI * rotation;

            root.position.x = x;
            root.position.y = y;
            root.position.z = z;
            collidableObjects.push(root);

            if (objUrl === 'obj/trash/trash_bag.obj'){
                root.isCollectible = true;
                root.collectedValue = 4;
                trash.push(root);
            }
            else if (objUrl === 'obj/trash/bottle2.obj'){
                root.isCollectible = true;
                root.collectedValue = 2;
                trash.push(root);

            }
            else if (objUrl === 'obj/trash/bottle1.obj'){
                root.isCollectible = true;
                root.collectedValue = 2;
                trash.push(root);

            }
            else if (objUrl === 'obj/trash/bottle3.obj'){
                root.isCollectible = true;
                root.collectedValue = 2;
                trash.push(root);

            }

            else if (objUrl === ' obj/field/poo.obj'){
                root.isCollectible = true;
                root.collectedValue = 1;
                trash.push(root);

            }

           


            if (draggable)
                objects.push(root);
            if ( objUrl === 'obj/vehicle/truck.obj')
                truck.add(root);
            else
                scene.add(root);
        
            
        
            });

    });

}


document.addEventListener('keydown', function (event) {
    
    // add to collect datas
    if (event.keyCode === 76)
    {
        if (spotLight.intensity === 1)
            spotLight.intensity = 0;
        else if(spotLight.intensity === 0)
            spotLight.intensity = 1;
    }
    
    var targetChanged = true;
    
    if (event.keyCode == 70) {
        if (control_target == player)
        {
            if(playerCanMountTruck()){
                control_target = truck;
                player.visible = false;
                player.position.x = truck.position.x;
                player.position.y = truck.position.y;
                player.position.z = truck.position.z;
            }
            else{
                targetChanged = false;
            }

        } 
        else
        {
            control_target = player;
            player.visible = true;
            player.position.x = truck.position.x - 8;
            player.position.y = truck.position.y;
            player.position.z = truck.position.z;
        }
        if(targetChanged){
            controls = new THREE.PlayerControls(camera, control_target, collidableObjects, raycaster);

        }
        //controls.init();
        render();
    }
    
 }, true);


    function onRelease(event)
    {
        drag_controls.enabled = false;
        controls.enabled = true;
}

function onClick(event) {

    event.preventDefault();
    controls.enabled = false;

    if (enableSelection === true) {

        const draggableObjects = drag_controls.getObjects();
        draggableObjects.length = 0;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersections = raycaster.intersectObjects(objects, true);

        if (intersections.length > 0) {

            const object = intersections[ 0 ].object;

            if (group.children.includes(object) === true) {

                object.material.emissive.set(0x000000);
                scene.attach(object);

            } else {

                object.material.emissive.set(0xaaaaaa);
                group.attach(object);

            }

            drag_controls.transformGroup = true;
            draggableObjects.push(group);

        }

        if (group.children.length === 0) {

            drag_controls.transformGroup = false;
            draggableObjects.push(...objects);

        }

    }
    render();

}


function playerCanMountTruck(){
    
	const rays = [
		new THREE.Vector3(0, 1, 1),
		new THREE.Vector3(1, 1, 1),
		new THREE.Vector3(1, 1, 0),
		new THREE.Vector3(1, 1, -1),
		new THREE.Vector3(0, 1, -1),
		new THREE.Vector3(-1, 1, -1),
		new THREE.Vector3(-1, 1, 0),
		new THREE.Vector3(-1, 1, 1)
	  ];
        var distance = 30;
        var nearTruck = false;

    
		
		

		var playerDirection = new THREE.Vector3();
		player.getWorldDirection(playerDirection);

        player.worldDirection = playerDirection;
        
		for (let i = 0; i < rays.length; i += 1) {
			// We reset the raycaster to this direction
			raycaster.set(player.position, rays[i]);
			// Test if we intersect with any obstacle mesh
			const intersects = raycaster.intersectObjects([truck], true);
            // And disable that direction if we do
			if (intersects.length > 0 && intersects[0].distance <= distance) {
			  // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
			  
			  nearTruck = true;
			  
	
			}
        }
			
        return nearTruck;

    }
	
function randomInt(min, max) { // min and max included 
  return Math.round(Math.random() * (max - min + 1) + min);
}

// random waste generator
setInterval(function(){
    var rand = Math.floor(Math.random() * 4)
    var rand_x = Math.floor(Math.random() * 140) -70;
    var rand_y = 0;
    var rand_z = Math.floor(Math.random() * 300) -180;
    console.log(rand_x, rand_z);
    if (rand == 0)
    {objectLoader('obj/trash/trash_bag.mtl', 'obj/trash/trash_bag.obj', rand_x, rand_z, rand_y, true);}
    if (rand == 1)
    {objectLoader('obj/trash/bottle2.mtl', 'obj/trash/bottle2.obj', rand_x, rand_z, rand_y, true);}
    if (rand == 2)
    {objectLoader('obj/trash/bottle1.mtl', 'obj/trash/bottle1.obj', rand_x, rand_z, rand_y, true);}
    if (rand == 3)
    {    objectLoader('obj/trash/bottle3.mtl', 'obj/trash/bottle3.obj', rand_x, rand_z, rand_y, true);}
 }, 800);
 
 setInterval(function(){
     var rand_x = Math.floor(Math.random() * 100) + -170;
     var rand_z = Math.floor(Math.random() * 30) -40;
     objectLoader('obj/field/poo.mtl', 'obj/field/poo.obj', rand_x, rand_z, 0, true);
 }, 1000);


 function pickTrash(){
    const rays = [
		new THREE.Vector3(0, 1, 1),
		new THREE.Vector3(1, 1, 1),
		new THREE.Vector3(1, 1, 0),
		new THREE.Vector3(1, 1, -1),
		new THREE.Vector3(0, 1, -1),
		new THREE.Vector3(-1, 1, -1),
		new THREE.Vector3(-1, 1, 0),
		new THREE.Vector3(-1, 1, 1)
	  ];
        var distance = 30;

    
		
		

		var playerDirection = new THREE.Vector3();
		player.getWorldDirection(playerDirection);

        player.worldDirection = playerDirection;
        
		for (let i = 0; i < rays.length; i += 1) {
			// We reset the raycaster to this direction
			raycaster.set(player.position, rays[i]);
			// Test if we intersect with any obstacle mesh
			const intersects = raycaster.intersectObjects(trash, true);
            // And disable that direction if we do
			if (intersects.length > 0 && intersects[0].distance <= distance) {
			  // Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
			  
			    console.log(intersects[0].object);
                intersects[0].object.visible = false;
	
			}
        }
			
 }