import * as THREE from './resources/threejs/r122/build/three.module.js';
import {OrbitControls} from './resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {OBJLoader2} from './resources/threejs/r122/examples/jsm/loaders/OBJLoader2.js';
//import { PointerLockControls } from './resources/threejs/r112/examples/jsm/controls/PointerLockControls.js';

    function main() {
  /* ObJECTS */
  var player = new THREE.Object3D();
  /* OBJECTS */
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});
  var movement = 0;
  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 15, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('cyan');

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
    const objLoader = new OBJLoader2();
      objLoader.load('resources/FinalBaseMesh.obj', (root) => {
      root.scale.set(0.5, 0.5, 0.5);
      root.rotation.y = Math.PI * -1;
      player.add(root);
      //scene.add(root);
    });
  //

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    scene.add(player);
    
    
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

