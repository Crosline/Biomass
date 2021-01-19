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

var player = new THREE.Object3D();
var truck = new THREE.Object3D();
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
    


    loadApartment(10, 10, 1, 1);
    loadApartment(10, 30, 1, 2);
    loadApartment(10, 50, 1, 3);
    loadApartment(30, 30, 1, 4);
    loadApartment(50, 50, 2, 15);


    objectLoader('obj/trash/bottle1.mtl', 'obj/trash/bottle1.obj', 0, 5, 0, true);
    objectLoader('obj/trash/bottle2.mtl', 'obj/trash/bottle2.obj', -5, 5, 0, true);
    objectLoader('obj/trash/bottle3.mtl', 'obj/trash/bottle3.obj', -10, 5, 0, true);

    objectLoader('obj/trash/trash_bag.mtl', 'obj/trash/trash_bag.obj', 0, 10, 0, true);
    objectLoader('obj/trash/trash_can.mtl', 'obj/trash/trash_can.obj', -5, 10, 0, true);
    objectLoader('obj/trash/trash_can_wlid.mtl', 'obj/trash/trash_can_wlid.obj', -10, 10, 0, true);

    objectLoader('obj/trash/trash_dumpster.mtl', 'obj/trash/trash_dumpster.obj', 0, 15, 0, );
    objectLoader('obj/trash/trash_dumpster_open.mtl', 'obj/trash/trash_dumpster_open.obj', -5, 15, 0);
    objectLoader('obj/character/character.mtl', 'obj/character/character.obj', -10, 15, 0, true);

    //objectLoader('obj/vehicle/truck.mtl', 'obj/vehicle/truck.obj', -20, 15, 0, false);


    //
    //player.position.x = 0;
    //player.rotation.y += Math.PI * 0.5;
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

function loadApartment(x = 0, z = 0, type = 1, floor = 1, y = 0.0) {

    type = type.toString();

    objectLoader('obj/apartment/' + type + '/bot.mtl', 'obj/apartment/' + type + '/bot.obj', x, z, y + 0);

    var i = 1;
    for (; i < floor; i++)
        objectLoader('obj/apartment/' + type + '/mid.mtl', 'obj/apartment/' + type + '/mid.obj', x, z, y + 3.417 * i);

    objectLoader('obj/apartment/' + type + '/top.mtl', 'obj/apartment/' + type + '/top.obj', x, z, y + 3.417 * floor);

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
    
    
    
    if (event.keyCode == 70) {
        if (control_target == player)
        {
            control_target = truck;
            //player.visible = false;
            //player.position.x = truck.position.x;
           // player.position.y = truck.position.y;
            //player.position.z = truck.position.z;
        } 
        else
        {
            control_target = player;
            //player.visible = true;
            //player.position.x = truck.position.x - 10;
            //player.position.y = truck.position.y;
            //player.position.z = truck.position.z;
        }
        controls = new THREE.PlayerControls(camera, control_target, collidableObjects, raycaster);
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