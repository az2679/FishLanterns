import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { MapControls } from 'three/addons/controls/MapControls';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper';

// app
const app = document.querySelector('#app');

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe2eafc);
scene.fog = new THREE.FogExp2(0xe2eafc, 0.001);

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// directional light
const dirLight = new THREE.DirectionalLight(0xcddafd, 0.5);
dirLight.position.set(0, 50, -100);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0xff0f7b, 20, 150);
pointLight1.position.set(50, 125, 10);
// scene.add(pointLight1);
const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 10);
// scene.add(pointLightHelper1);

// const hemiLight = new THREE.HemisphereLight(0xf6ae2d, 0xff0a54, 0.2);
// hemiLight.position.set(200, 140, 0);
// scene.add(hemiLight);
// const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
// scene.add(hemiLightHelper);

// perspective camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
// orthographic camera
// const camera = new THREE.OrthographicCamera(
//   window.innerWidth / -2,
//   window.innerWidth / 2,
//   window.innerHeight / 2,
//   window.innerHeight / -2,
//   0,
//   3000
// );
camera.position.set(200, 100, 400);
camera.lookAt(0, 0, 0);
scene.add(camera);

// axis helper -> X: red, Y: green, Z: blue
const axesHelper = new THREE.AxesHelper(50);
axesHelper.position.y = 0.01; // above the ground slightly
scene.add(axesHelper);

// control
const controls = new OrbitControls(camera, renderer.domElement); // orbit control
// const controls = new MapControls(camera, renderer.domElement); // map control
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.enableRotate = true;
controls.rotateSpeed = 0.3;
controls.enableZoom = true;
controls.zoomSpeed = 0.5;
controls.minDistance = 10;
controls.maxDistance = 1000;

// first person control
// const controls = new FirstPersonControls(camera, renderer.domElement);
// controls.movementSpeed = 100;
// controls.lookSpeed = 0.02;
// const clock = new THREE.Clock(); // requires delta time value in update()

/*
////////////////////////////////////////////////////////////////////////////////
objects, you don't need to modify for week2 
*/
//0xc1d3fe
// ground
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xc1d3fe,
  // roughness: 0.8,
  // metalness: 0.2,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI * 0.5;
scene.add(groundMesh);

// spheres
const geometry = new THREE.SphereGeometry(5, 128, 128);
const material = new THREE.MeshPhongMaterial({
  color: 0xffffff,
});
for (let i = 0; i < 30; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -i * 100;
  // scene.add(mesh);
}

// big sphere
const sphereMesh = new THREE.Mesh(geometry, material);
sphereMesh.position.y = 130;
sphereMesh.position.x = -10;
// sphereMesh.scale.setScalar(3);
// scene.add(sphereMesh);

//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*                                                          3D ASSETS                                                 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loader = new GLTFLoader();

/*                                               ASSET: FISH LANTERN + FLAME                                          */

const fishLanternGroup = new THREE.Group();
const fishLight1 = new THREE.PointLight(0xffc8c8, 20, 150);
scene.add(fishLight1);
const fishLightHelper1 = new THREE.PointLightHelper(fishLight1, 10);
// scene.add(fishLightHelper1);

const fishLight2 = new THREE.PointLight(0x003566, 50, 175);
scene.add(fishLight2);
const fishLightHelper2 = new THREE.PointLightHelper(fishLight2, 10);
// scene.add(fishLightHelper2);

//Fish Lantern with Flame
let mixer;
loader.load(
  '/Fishv8.glb',
  //Fishv8 internal wires; Fishv6 external wires
  //75%transmissive, 0 Roughness

  function (gltf) {
    console.log(`Fish Lantern gltf: `, gltf);

    gltf.scene.position.x = 0;
    gltf.scene.position.y = 90;
    gltf.scene.position.z = 0;
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.scale.setScalar(5);

    fishLight1.position.set(gltf.scene.position.x - 10, gltf.scene.position.y + 40, gltf.scene.position.z + 5);
    fishLight2.position.set(gltf.scene.position.x + 35, gltf.scene.position.y + 40, gltf.scene.position.z + 5);

    // Flame
    loader.load(
      '/flame.glb',
      //https://sketchfab.com/3d-models/fire-animation-fc890bebb4ba44dcb900d50658af123f
      function (gltfFlame) {
        console.log(`Flame gltf: `, gltfFlame);
        gltfFlame.scene.traverse(function (el) {
          // console.log('traverse: ', el);
          if (el.isMesh) {
            // console.log('isMesh: ', el);
            el.material.color.r = 0.5;
            el.material.color.g = 0.5;
            el.material.color.b = 0.5;
          }
        });
        mixer = new THREE.AnimationMixer(gltfFlame.scene);
        mixer.clipAction(gltfFlame.animations[0]).play();
        gltfFlame.scene.position.set(gltf.scene.position.x + 10, gltf.scene.position.y + 50, gltf.scene.position.z + 5);
        gltfFlame.scene.scale.setScalar(9);
        fishLanternGroup.add(gltfFlame.scene);
      }
    );

    // gsap.to(lanternGroup.rotation, {
    //   y: Math.PI * 2,
    //   duration: 30,
    //   repeat: -1,
    //   ease: 'none',
    //   // repeatRefresh: true,
    //   //yoyo: true,
    // });

    // gsap.to(lanternGroup.position, {
    //   x: 300,
    //   duration: 15,
    //   repeat: -1,
    //   ease: 'none',
    //   // repeatRefresh: true,
    //   yoyo: true,
    // });

    fishLanternGroup.add(gltf.scene);
    fishLanternGroup.add(fishLight1);
    fishLanternGroup.add(fishLight2);

    scene.add(fishLanternGroup);
  },

  function (xhr) {
    // console.log('Fish Lantern: ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//Flame test
// let mixer;
// loader.load(
//   '/flame.glb',
//   //https://sketchfab.com/3d-models/fire-animation-fc890bebb4ba44dcb900d50658af123f

//   function (gltf) {
//     console.log(`Flame gltf: `, gltf);

//     gltf.scene.traverse(function (el) {
//       // console.log('traverse: ', el);
//       if (el.isMesh) {
//         // console.log('isMesh: ', el);
//         el.material.color.r = 0.5;
//         el.material.color.g = 0.5;
//         el.material.color.b = 0.5;
//       }
//     });

//     mixer = new THREE.AnimationMixer(gltf.scene);
//     mixer.clipAction(gltf.animations[0]).play();

//     gltf.scene.position.x = fishLanternGroupX + 10;
//     gltf.scene.position.y = fishLanternGroupY + 50;
//     gltf.scene.position.z = fishLanternGroupZ + 5;
//     // gltf.scene.rotation.y = Math.PI / 2;
//     gltf.scene.scale.setScalar(9);

//     fishLanternGroup.add(gltf.scene);
//   },

//   function (xhr) {
//     console.log('Flame: ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

/*

*/
/*                                                  ASSET: ROUND LANTERN                                              */

const roundLanternGroup = new THREE.Group();
const lanternLight = new THREE.PointLight(0xc1121f, 20, 150);
scene.add(lanternLight);
const lanternLightHelper = new THREE.PointLightHelper(lanternLight, 10);
// scene.add(lanternLightHelper);

//round lantern single
loader.load(
  '/paperLantern.glb',

  function (gltf) {
    console.log(`Round Lantern gltf: `, gltf);

    gltf.scene.traverse(function (el) {
      // console.log('traverse: ', el);
      if (el.isMesh) {
        // console.log('isMesh: ', el);
        el.material._transmission = 1;
        el.material.transparent = true;
        // el.material.opacity = 0.9;
        el.material.color.r = 1;
        el.material.color.g = 0.45;
        el.material.color.b = 0.56;
      }
    });

    gltf.scene.position.x = 120;
    gltf.scene.position.y = 140;
    gltf.scene.position.z = 0;
    gltf.scene.scale.setScalar(0.15);

    roundLanternGroup.add(gltf.scene);
    roundLanternGroup.add(lanternLight);
    lanternLight.position.copy(gltf.scene.position);

    scene.add(roundLanternGroup);
  },

  function (xhr) {
    // console.log('Round Lantern: ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//round lantern loop
let lanterns = [];
const lanternManager = new THREE.LoadingManager();
const lanternLoader = new GLTFLoader(lanternManager);
lanternManager.onLoad = () => {
  lanternPos();
};
for (let i = 0; i < 7; i++) {
  lanternLoader.load('/paperLantern.glb', (gltf) => {
    gltf.scene.scale.setScalar(0.15);
    gltf.scene.position.x = ranIntCond(-300, 300);
    gltf.scene.position.y = ranInt(30, 400);
    gltf.scene.position.z = ranIntCond(-300, 300);
    gltf.scene.rotation.z = ranInt(-1.5, 1.5);
    scene.add(gltf.scene);
    lanterns.push(gltf);
  });
}
function lanternPos() {
  // console.log(lanterns);
  for (let i = 0; i < lanterns.length; i++) {
    // console.log(lanterns[i].scene.position.x, lanterns[i].scene.position.y, lanterns[i].scene.position.z);
  }
}

//random number
function ranInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function ranIntCond(min, max) {
  let int;
  while (true) {
    int = Math.floor(Math.random() * (max - min + 1)) + min;
    if (int <= -150 || int >= 150) {
      break;
    }
  }
  // console.log(int);
  return int;
}

//
//
//
/*                                      ASSET: CLOUDS                                      */

//cloud test
const cloudLight = new THREE.PointLight(0xffffff, 20, 100);
cloudLight.position.set(0, 10, -10);
// scene.add(cloudLight);
const cloudLightHelper = new THREE.PointLightHelper(cloudLight, 10);
// scene.add(cloudLightHelper);
loader.load(
  '/cloud.glb',
  //https://sketchfab.com/3d-models/cloud-test-6d1fff581b3a424d88ee2125f909f3f3

  function (gltf) {
    console.log(`Cloud gltf: `, gltf);

    // gltf.scene.traverse(function (el) {
    //   // console.log('traverse: ', el);
    //   if (el.isMesh) {
    //     // console.log('isMesh: ', el);
    //     // el.material.color.r = 0.5;
    //     // el.material.color.g = 0.5;
    //     // el.material.color.b = 0.5;
    //   }
    // });

    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    gltf.scene.position.z = 0;
    gltf.scene.scale.setScalar(30);

    // scene.add(gltf.scene);
  },

  function (xhr) {
    // console.log('Cloud: ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//cloud loop
let clouds = [];
const cloudManager = new THREE.LoadingManager();
const cloudLoader = new GLTFLoader(cloudManager);
cloudManager.onLoad = () => {
  cloudPos();
  // cloudLightPos();
};
for (let i = 0; i < 8; i++) {
  cloudLoader.load('/cloud.glb', (gltf) => {
    gltf.scene.scale.setScalar(30);
    scene.add(gltf.scene);
    clouds.push(gltf);
    // console.log(clouds);
  });
}
function cloudPos() {
  // console.log(clouds);

  clouds[1].scene.position.set(200, 50, -150);
  clouds[4].scene.position.set(75, 0, -225);
  clouds[0].scene.position.set(175, 100, -275);
  //
  clouds[2].scene.position.set(-75, 0, 200);
  clouds[3].scene.position.set(-150, 25, 175);

  clouds[5].scene.position.set(ranIntCond(-500, 500), ranInt(-100, 500), ranIntCond(-500, 500));
  clouds[6].scene.position.set(ranIntCond(-500, 500), ranInt(-100, 500), ranIntCond(-500, 500));
  clouds[7].scene.position.set(ranIntCond(-500, 500), ranInt(-100, 500), ranIntCond(-500, 500));
}

const cloudLight1 = new THREE.PointLight(0xffffff, 20, 100);
cloudLight1.position.set(150, 100, -225);
scene.add(cloudLight1);
const cloudLightHelper1 = new THREE.PointLightHelper(cloudLight1, 10);
// scene.add(cloudLightHelper1);
const cloudLight2 = new THREE.PointLight(0xffffff, 20, 100);
cloudLight2.position.set(200, 100, -150);
scene.add(cloudLight2);
const cloudLightHelper2 = new THREE.PointLightHelper(cloudLight2, 10);
// scene.add(cloudLightHelper2);
//
const cloudLight3 = new THREE.PointLight(0xffffff, 20, 150);
cloudLight3.position.set(-175, 150, 175);
scene.add(cloudLight3);
const cloudLightHelper3 = new THREE.PointLightHelper(cloudLight3, 10);
// scene.add(cloudLightHelper3);
const cloudLight4 = new THREE.PointLight(0xffffff, 50, 75);
cloudLight4.position.set(-40, 75, 250);
scene.add(cloudLight4);
const cloudLightHelper4 = new THREE.PointLightHelper(cloudLight4, 10);
// scene.add(cloudLightHelper4);

// let cloudLights = [];
// function cloudLightPos() {
//   for (let i = 0; i < clouds.length; i++) {
//     const cloudLight = new THREE.PointLight(0xffffff, 20, 100);
//     // cloudLight.position.set(0, 10, -10);
//     scene.add(cloudLight);
//     cloudLights.push(cloudLight);
//     cloudLights[i].position.set(clouds[i].scene.position.x, clouds[i].scene.position.y, clouds[i].scene.position.z);
//   }
// }

//
//
//
/*                                      GEOMETRIES                                      */
//rose
for (let i = 0; i < 3; i++) {
  const roseGeometry = new THREE.TorusKnotGeometry(5, 3, 85, 6, 20, 1);
  const roseMaterial = new THREE.MeshStandardMaterial({ color: 0xc1121f });
  const rose = new THREE.Mesh(roseGeometry, roseMaterial);
  rose.position.x = ranIntCond(-300, 300);
  rose.position.y = ranInt(30, 400);
  rose.position.z = ranIntCond(-300, 300);
  rose.rotation.set(ranInt(0, 6.28), ranInt(0, 6.28), ranInt(0, 6.28));
  const roseMaterialWire = new THREE.MeshStandardMaterial({
    color: 0x780000,
    wireframe: true,
    wireframeLinewidth: 2,
  });
  const roseWire = new THREE.Mesh(roseGeometry.clone(), roseMaterialWire);
  roseWire.position.copy(rose.position);
  roseWire.rotation.copy(rose.rotation);

  scene.add(rose);
  scene.add(roseWire);
}

//daisy
for (let i = 0; i < 3; i++) {
  const daisyGeometry = new THREE.TorusKnotGeometry(5, 3, 85, 6, 1, 5);
  const daisyMaterial = new THREE.MeshStandardMaterial({ color: 0xf5cac3 });
  const daisy = new THREE.Mesh(daisyGeometry, daisyMaterial);
  daisy.position.set(ranIntCond(-300, 300), ranInt(30, 400), ranIntCond(-300, 300));
  daisy.rotation.set(ranInt(0, 6.28), ranInt(0, 6.28), ranInt(0, 6.28));
  scene.add(daisy);
}

//stars
for (let i = 0; i < 3; i++) {
  const starGeometry = new THREE.OctahedronGeometry(5, 0);
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xf9c74f });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.set(ranIntCond(-300, 300), ranInt(30, 400), ranIntCond(-300, 300));
  star.rotation.set(ranInt(0, 6.28), ranInt(0, 6.28), ranInt(0, 6.28));
  scene.add(star);

  const star1Geometry = new THREE.IcosahedronGeometry(5, 0);
  const star1Material = new THREE.MeshStandardMaterial({ color: 0xe9f5db });
  const star1 = new THREE.Mesh(star1Geometry, star1Material);
  star1.position.set(ranIntCond(-300, 300), ranInt(30, 400), ranIntCond(-300, 300));
  star1.rotation.set(ranInt(0, 6.28), ranInt(0, 6.28), ranInt(0, 6.28));
  scene.add(star1);
}

//Koi Fish
let mixerKoi;
loader.load(
  '/koiFish/scene.gltf',

  function (gltf) {
    console.log(`Koi gltf: `, gltf);

    mixerKoi = new THREE.AnimationMixer(gltf.scene);
    mixerKoi.clipAction(gltf.animations[0]).play();

    gltf.scene.position.x = 0;
    gltf.scene.position.y = 50;
    gltf.scene.position.z = 0;
    gltf.scene.rotation.y = 2 * Math.PI;
    gltf.scene.scale.setScalar(6);

    scene.add(gltf.scene);
  },

  function (xhr) {
    // console.log('Koi: ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// resize
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  // camera.left = window.innerWidth / -2;
  // camera.right = window.innerWidth / 2;
  // camera.top = window.innerHeight / 2;
  // camera.bottom = window.innerHeight / -2;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onResize);

const clock = new THREE.Clock();

// animate
const animate = () => {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);
  if (mixerKoi) mixerKoi.update(delta);

  controls.update();
  // controls.update(clock.getDelta());

  renderer.render(scene, camera);
};

animate();
