import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';

import { MapControls } from 'three/addons/controls/MapControls';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// intersected object
let INTERSECTED;

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

//random number
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDirection() {
  return Math.random() > 0.5 ? 1 : -1;
}

function randomIntCondition(min, max) {
  // const x = randomInt(min, max) * randomDirection();
  // const y = randomInt(min, max) * randomDirection();
  // const z = randomInt(min, max) * randomDirection();
  // return { x, y, z };

  return randomInt(min, max) * randomDirection();
}

gsap.registerEffect({
  name: 'float',
  extendTimeline: true,
  defaults: {
    duration: randomInt(30, 40),
  },
  effect: (targets, config) => {
    // console.log(targets);
    // console.log(targets[0].children[0].children[0].material);
    // console.log(targets[0].children[0].children[1].material);

    // targets[0].traverse(function (el) {
    //   // console.log('traverse: ', el);
    //   if (el.isMesh) {
    //     // console.log('isMesh: ', el);
    //     el.material.transparent = true;
    //     el.material.opacity = 0;
    //   }
    // });

    let tl = gsap.timeline();
    tl.fromTo(
      targets[0].children[0].children[1].material,
      { opacity: 0, transparent: true },
      { opacity: 1, transparent: false, duration: 1 }
    )
      .fromTo(
        targets[0].children[0].children[0].material,
        { opacity: 0, transparent: true },
        { opacity: 1, transparent: false, duration: 1 },
        '<'
      )
      .to(targets[0].position, { x: 800, duration: config.duration, ease: 'none' }, '-=1')
      .to(targets[0].children[0].children[1].material, { opacity: 0, transparent: true, duration: 1 }, '-=2')
      .to(targets[0].children[0].children[0].material, { opacity: 0, transparent: true, duration: 1 }, '<')
      .to(
        targets[0].position,
        {
          y: 5,
          duration: 2,
          repeat: -1,
          ease: 'sine.inOut',
          yoyo: true,
        },
        '-=100%'
      );
    return tl;
  },
});

/*                                               ASSET: FISH LANTERN + FLAME                                          */

const fishLanternGroup = new THREE.Group();
const fishLanternLight1 = new THREE.PointLight(0xffc8c8, 20, 150);
// scene.add(fishLanternLight1);
const fishLanternLightHelper1 = new THREE.PointLightHelper(fishLanternLight1, 10);
// scene.add(fishLanternLightHelper1);

const fishLanternLight2 = new THREE.PointLight(0x003566, 50, 175);
// scene.add(fishLanternLight2);
const fishLanternLightHelper2 = new THREE.PointLightHelper(fishLanternLight2, 10);
// scene.add(fishLanternLightHelper2);

//Fish Lantern with Flame
let mixer;
loader.load(
  '/Fishv8.glb',
  //Fishv8 internal wires; Fishv6 external wires
  //75%transmissive, 0 Roughness

  function (gltf) {
    console.log(`Fish Lantern gltf: `, gltf);

    gltf.scene.position.set(0, 90, 0);
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.scale.setScalar(5);

    fishLanternLight1.position.set(gltf.scene.position.x - 10, gltf.scene.position.y + 40, gltf.scene.position.z + 5);
    fishLanternLight2.position.set(gltf.scene.position.x + 35, gltf.scene.position.y + 40, gltf.scene.position.z + 5);

    fishLanternGroup.add(gltf.scene);
    fishLanternGroup.add(fishLanternLight1);
    fishLanternGroup.add(fishLanternLight2);

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

    gsap.to(fishLanternGroup.position, {
      y: 10,
      duration: 5,
      repeat: -1,
      ease: 'power2.inOut',
      // repeatRefresh: true,
      yoyo: true,
    });

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
/*                                               ASSET: MINI FISH LANTERN                                          */

const fishGroup = new THREE.Group();
// const fishLight1 = new THREE.PointLight(0xffc8c8, 20, 50);
// scene.add(fishLight1);
// const fishLightHelper1 = new THREE.PointLightHelper(fishLight1, 5);
// scene.add(fishLightHelper1);
loader.load('/Fishv8.glb', function (gltf) {
  gltf.scene.position.set(-400, 25, 100);
  gltf.scene.rotation.y = Math.PI / 2;

  const randomNum = randomInt(1, 2);
  gltf.scene.scale.setScalar(randomNum);
  const fishLight = new THREE.PointLight(0xffc8c8, 20, randomNum * 20);

  fishLight.position.set(gltf.scene.position.x + 5, gltf.scene.position.y + 15, gltf.scene.position.z);

  fishGroup.add(gltf.scene);
  fishGroup.add(fishLight);

  gsap.effects.float(fishGroup);
  scene.add(fishGroup);
});

const fishGroup1 = new THREE.Group();
loader.load('/Fishv8.glb', function (gltf) {
  gltf.scene.position.set(-500, 200, -100);
  gltf.scene.rotation.y = Math.PI / 2;

  const randomNum = randomInt(2, 3);
  gltf.scene.scale.setScalar(randomNum);
  const fishLight1 = new THREE.PointLight(0xffc8c8, 20, randomNum * 20);
  fishLight1.position.set(gltf.scene.position.x + 5, gltf.scene.position.y + 15, gltf.scene.position.z);

  fishGroup1.add(gltf.scene);
  fishGroup1.add(fishLight1);

  gsap.effects.float(fishGroup1);

  scene.add(fishGroup1);
});

const fishGroup2 = new THREE.Group();
loader.load('/Fishv8.glb', function (gltf) {
  gltf.scene.position.set(-300, 75, 200);
  gltf.scene.rotation.y = Math.PI / 2;

  const randomNum = randomInt(1, 2);
  gltf.scene.scale.setScalar(randomNum);
  const fishLight2 = new THREE.PointLight(0xffc8c8, 20, randomNum * 20);

  fishLight2.position.set(gltf.scene.position.x + 5, gltf.scene.position.y + 15, gltf.scene.position.z);

  fishGroup2.add(gltf.scene);
  fishGroup2.add(fishLight2);
  gsap.effects.float(fishGroup2);
  scene.add(fishGroup2);
});

//
//
//
/*                                                  ASSET: KOI FISH                                              */

let mixerKoi;
const koiGroup = new THREE.Group();
loader.load(
  '/koiFish/scene.gltf',

  function (gltf) {
    console.log(`Koi gltf: `, gltf);

    mixerKoi = new THREE.AnimationMixer(gltf.scene);
    mixerKoi.clipAction(gltf.animations[0]).play();

    koiGroup.add(gltf.scene);

    //changes range of rotation path
    gltf.scene.position.set(20, 5, 85);
    gltf.scene.rotation.set(0, 2 * Math.PI, 0);
    gltf.scene.scale.setScalar(6);

    //changes position
    koiGroup.translateY(fishLanternGroup.position.y + 135);

    gsap.to(koiGroup.rotation, {
      y: Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: 'none',
    });
    gsap.to(gltf.scene.rotation, {
      x: Math.PI * 2,
      duration: 3,
      repeat: -1,
      ease: 'power2.inOut',
      repeatDelay: 5,
    });
    gsap.to(koiGroup.rotation, {
      x: Math.PI * 0.1,
      duration: 60,
      repeat: -1,
      ease: 'power2.inOut',
    });
    // gsap.to(gltf.scene.position, {
    //   y: 45,
    //   duration: 3,
    //   repeat: -1,
    //   ease: 'none',
    //   yoyo: true,
    // });

    // scene.add(gltf.scene);
    scene.add(koiGroup);
  },

  function (xhr) {
    // console.log('Koi: ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

//
//
//
/*                                                  ASSET: ROUND LANTERN                                              */

//round lanterns
const roundLanternGroup = new THREE.Group();
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

    gltf.scene.position.set(120, 125, 10);
    gltf.scene.scale.setScalar(0.15);
    gltf.scene.rotation.set(0, Math.PI / 4, -Math.PI / 8);

    const lanternLight = new THREE.PointLight(0xc1121f, 20, 150);
    lanternLight.position.copy(gltf.scene.position);
    const lanternLightHelper = new THREE.PointLightHelper(lanternLight, 10);

    roundLanternGroup.add(gltf.scene);
    roundLanternGroup.add(lanternLight);

    gsap.to(roundLanternGroup.position, {
      y: 5,
      duration: 2,
      repeat: -1,
      ease: 'power2.inOut',
      yoyo: true,
    });
    gsap.to(gltf.scene.rotation, {
      x: randomInt(1, 3) / 10,
      y: randomInt(1, 3) / 10,
      z: randomInt(1, 2) / 10,
      duration: 3,
      repeat: -1,
      ease: 'power2.inOut',
      yoyo: true,
    });

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
const roundLanternGroup1 = new THREE.Group();
loader.load('/paperLantern.glb', function (gltf) {
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

  gltf.scene.position.set(-150, 125, 10);
  gltf.scene.rotation.set(0, Math.PI / 4, -Math.PI / 8);
  gltf.scene.scale.setScalar(0.15);

  const lanternLight1 = new THREE.PointLight(0xc1121f, 20, 150);
  lanternLight1.position.copy(gltf.scene.position);
  const lanternLightHelper1 = new THREE.PointLightHelper(lanternLight1, 10);

  roundLanternGroup1.add(gltf.scene);
  roundLanternGroup1.add(lanternLight1);

  gsap.to(roundLanternGroup1.position, {
    y: 5,
    duration: 2.5,
    repeat: -1,
    ease: 'power2.inOut',
    yoyo: true,
  });
  gsap.to(gltf.scene.rotation, {
    x: randomInt(1, 3) / 10,
    y: randomInt(1, 3) / 10,
    z: randomInt(1, 2) / 10,
    duration: 4,
    repeat: -1,
    ease: 'power2.inOut',
    yoyo: true,
  });

  scene.add(roundLanternGroup1);
});

//round lantern loop
let lanterns = [];
const lanternManager = new THREE.LoadingManager();
const lanternLoader = new GLTFLoader(lanternManager);
lanternManager.onLoad = () => {
  // lanternPos();
};
// for (let i = 0; i < 7; i++) {
//   lanternLoader.load('/paperLantern.glb', (gltf) => {
//     gltf.scene.scale.setScalar(0.05);
//     gltf.scene.position.x = randomIntCondition(150, 300);
//     gltf.scene.position.y = randomInt(30, 400);
//     gltf.scene.position.z = randomIntCondition(150, 300);
//     gltf.scene.rotation.z = randomInt(-1.5, 1.5);
//     scene.add(gltf.scene);
//     lanterns.push(gltf);
//   });
// }
function lanternPos() {
  console.log(lanterns);
  // for (let i = 0; i < lanterns.length; i++) {
  // console.log(lanterns[i].scene.position.x, lanterns[i].scene.position.y, lanterns[i].scene.position.z);
  // }
}

//
//
//
/*                                      ASSET: CLOUDS                                      */

// //cloud test
// const cloudLight = new THREE.PointLight(0xffffff, 20, 100);
// cloudLight.position.set(0, 10, -10);
// // scene.add(cloudLight);
// const cloudLightHelper = new THREE.PointLightHelper(cloudLight, 10);
// // scene.add(cloudLightHelper);
// loader.load(
//   '/cloud.glb',
//   //https://sketchfab.com/3d-models/cloud-test-6d1fff581b3a424d88ee2125f909f3f3

//   function (gltf) {
//     console.log(`Cloud gltf: `, gltf);

//     // gltf.scene.traverse(function (el) {
//     //   // console.log('traverse: ', el);
//     //   if (el.isMesh) {
//     //     // console.log('isMesh: ', el);
//     //     // el.material.color.r = 0.5;
//     //     // el.material.color.g = 0.5;
//     //     // el.material.color.b = 0.5;
//     //   }
//     // });

//     gltf.scene.position.x = 0;
//     gltf.scene.position.y = 0;
//     gltf.scene.position.z = 0;
//     gltf.scene.scale.setScalar(30);

//     scene.add(gltf.scene);
//   },

//   function (xhr) {
//     // console.log('Cloud: ' + (xhr.loaded / xhr.total) * 100 + '% loaded');
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

//cloud loop
let clouds = [];
const cloudManager = new THREE.LoadingManager();
const cloudLoader = new GLTFLoader(cloudManager);
cloudManager.onLoad = () => {
  // cloudPos();
};
for (let i = 0; i < 8; i++) {
  cloudLoader.load('/cloud.glb', (gltf) => {
    gltf.scene.scale.setScalar(30);
    gltf.scene.position.set(randomIntCondition(200, 400), randomInt(-10, 30), randomIntCondition(200, 300));
    // scene.add(gltf.scene);
    // clouds.push(gltf);
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
  //
  clouds[5].scene.position.set(randomIntCondition(150, 500), randomInt(-100, 500), randomIntCondition(150, 500));
  clouds[6].scene.position.set(randomIntCondition(150, 500), randomInt(-100, 500), randomIntCondition(150, 500));
  clouds[7].scene.position.set(randomIntCondition(150, 500), randomInt(-100, 500), randomIntCondition(150, 500));
}

const cloudLight1 = new THREE.PointLight(0xffffff, 20, 100);
cloudLight1.position.set(150, 100, -225);
// scene.add(cloudLight1);
const cloudLightHelper1 = new THREE.PointLightHelper(cloudLight1, 10);
// scene.add(cloudLightHelper1);
const cloudLight2 = new THREE.PointLight(0xffffff, 20, 100);
cloudLight2.position.set(200, 100, -150);
// scene.add(cloudLight2);
const cloudLightHelper2 = new THREE.PointLightHelper(cloudLight2, 10);
// scene.add(cloudLightHelper2);
//
const cloudLight3 = new THREE.PointLight(0xffffff, 20, 150);
cloudLight3.position.set(-175, 150, 175);
// scene.add(cloudLight3);
const cloudLightHelper3 = new THREE.PointLightHelper(cloudLight3, 10);
// scene.add(cloudLightHelper3);
const cloudLight4 = new THREE.PointLight(0xffffff, 50, 75);
cloudLight4.position.set(-40, 75, 250);
// scene.add(cloudLight4);
const cloudLightHelper4 = new THREE.PointLightHelper(cloudLight4, 10);
// scene.add(cloudLightHelper4);

//
//
//
/*                                      GEOMETRIES                                      */
//rose
for (let i = 0; i < 5; i++) {
  const roseGeometry = new THREE.TorusKnotGeometry(5, 3, 85, 6, 20, 1);
  const roseMaterial = new THREE.MeshStandardMaterial({ color: 0xc1121f });
  const rose = new THREE.Mesh(roseGeometry, roseMaterial);
  rose.position.set(randomIntCondition(100, 400), randomInt(30, 500), randomIntCondition(100, 400));
  rose.rotation.set(randomInt(0, 6.28), randomInt(0, 6.28), randomInt(0, 6.28));
  const roseMaterialWire = new THREE.MeshStandardMaterial({
    color: 0x780000,
    wireframe: true,
    wireframeLinewidth: 2,
  });
  const roseWire = new THREE.Mesh(roseGeometry.clone(), roseMaterialWire);
  roseWire.position.copy(rose.position);
  roseWire.rotation.copy(rose.rotation);
  rose.scale.setScalar(2);
  // scene.add(rose);
  // scene.add(roseWire);
  // let roseGroup = new THREE.Group();
  // roseGroup.add(rose);
  // // roseGroup.add(roseWire);
  // gsap.to(roseGroup.rotation, {
  //   x: Math.PI * 2,
  //   y: Math.PI * 2,
  //   duration: randomInt(30, 60),
  //   repeat: -1,
  //   ease: 'none',
  // });
  // gsap.to(rose.rotation, {
  //   x: Math.PI * 2,
  //   y: Math.PI * 2,
  //   z: Math.PI * 2,
  //   duration: randomInt(1, 10),
  //   repeatDelay: 5,
  //   repeat: -1,
  //   ease: 'none',
  // });
  // // gsap.to(roseWire.rotation, {
  // //   x: Math.PI * 2,
  // //   y: Math.PI * 2,
  // //   z: Math.PI * 2,
  // //   duration: randomInt(1, 10),
  // //   repeatDelay: 5,
  // //   repeat: -1,
  // //   ease: 'none',
  // // });
  // scene.add(roseGroup);
}

//daisy
for (let i = 0; i < 5; i++) {
  const daisyGeometry = new THREE.TorusKnotGeometry(5, 3, 85, 6, 1, 5);
  const daisyMaterial = new THREE.MeshStandardMaterial({ color: 0xf5cac3 });
  const daisy = new THREE.Mesh(daisyGeometry, daisyMaterial);
  daisy.position.set(randomIntCondition(200, 400), randomInt(30, 500), randomIntCondition(200, 400));
  daisy.rotation.set(randomInt(0, 6.28), randomInt(0, 6.28), randomInt(0, 6.28));
  daisy.scale.setScalar(2);
  // scene.add(daisy);
  let daisyGroup = new THREE.Group();
  daisyGroup.add(daisy);
  gsap.to(daisyGroup.rotation, {
    // x: Math.PI * 2,
    y: Math.PI * 2,
    // z: Math.PI * 2,
    duration: randomInt(60, 80),
    repeat: -1,
    ease: 'none',
  });
  gsap.to(daisy.rotation, {
    x: Math.PI * 2,
    y: Math.PI * 2,
    z: Math.PI * 2,
    duration: randomInt(1, 10),
    repeatDelay: 5,
    repeat: -1,
    ease: 'none',
  });
  // scene.add(daisyGroup);
}

//stars
for (let i = 0; i < 5; i++) {
  const starGeometry = new THREE.OctahedronGeometry(5, 0);
  const starMaterial = new THREE.MeshStandardMaterial({ color: 0xf9c74f });
  const star = new THREE.Mesh(starGeometry, starMaterial);
  star.position.set(randomIntCondition(100, 400), randomInt(30, 500), randomIntCondition(100, 400));
  star.rotation.set(randomInt(0, 6.28), randomInt(0, 6.28), randomInt(0, 6.28));
  star.scale.setScalar(2);
  // scene.add(star);
  // let starGroup = new THREE.Group();
  // starGroup.add(star);
  // gsap.to(starGroup.rotation, {
  //   x: Math.PI * 2,
  //   y: Math.PI * 2,
  //   // z: Math.PI * 2,
  //   duration: randomInt(30, 60),
  //   repeat: -1,
  //   ease: 'none',
  // });
  // gsap.to(star.rotation, {
  //   x: Math.PI * 2,
  //   y: Math.PI * 2,
  //   z: Math.PI * 2,
  //   duration: randomInt(1, 10),
  //   repeatDelay: 5,
  //   repeat: -1,
  //   ease: 'none',
  // });
  // scene.add(starGroup);

  const star1Geometry = new THREE.IcosahedronGeometry(5, 0);
  const star1Material = new THREE.MeshStandardMaterial({ color: 0xe9f5db, roughness: 0.8, metalness: 0.2 });
  const star1 = new THREE.Mesh(star1Geometry, star1Material);
  star1.position.set(randomIntCondition(100, 400), randomInt(30, 500), randomIntCondition(100, 400));
  star1.rotation.set(randomInt(0, 6.28), randomInt(0, 6.28), randomInt(0, 6.28));
  star1.scale.setScalar(2);
  star1.name = 'star1';
  star1.isAnimating = false;
  // scene.add(star1);
  const star1Group = new THREE.Group();
  star1Group.add(star1);
  gsap.to(star1Group.rotation, {
    // x: Math.PI * 2,
    y: Math.PI * 2,
    // z: Math.PI * 2,
    duration: randomInt(120, 150),
    repeat: -1,
    ease: 'none',
  });
  gsap.to(star1.rotation, {
    // x: Math.PI * 2,
    y: Math.PI * 2,
    // z: Math.PI * 2,
    duration: randomInt(1, 10),
    repeatDelay: 5,
    repeat: -1,
    ease: 'none',
  });
  // scene.add(star1Group);
}

//
//
//
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

const onPointerMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
};
window.addEventListener('pointermove', onPointerMove);

const onClick = () => {
  if (!INTERSECTED) return;

  if (INTERSECTED.isAnimating) {
    //reset
    // gsap.to(INTERSECTED.rotation, {
    //   y: randomInt(0, 6.28),
    //   duration: randomInt(1, 10),
    //   repeatDelay: 5,
    //   repeat: -1,
    //   ease: 'none',
    // });

    gsap.to(INTERSECTED.material.color, {
      r: 0,
      g: 0,
      b: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      overwrite: true,
    });

    INTERSECTED.isAnimating = false;
  } else {
    //effect when it clicked - add point light or  make it spin fade out
    gsap.to(INTERSECTED.rotation, {
      y: Math.PI * 4,
      duration: 0.5,
      ease: 'power2.inOut',
      // repeat: -1,
      // repeatDelay: 2,
    });

    // const c = randomColor({
    //   hue: '#0000FF',
    //   luminosity: 'bright',
    // });
    // const { r, g, b } = new THREE.Color(c);
    // gsap.to(INTERSECTED.material.color, {
    //   r,
    //   g,
    //   b,
    //   duration: 1,
    //   ease: 'power2.inOut',
    // });

    INTERSECTED.isAnimating = true;
  }
};
window.addEventListener('click', onClick);

const clock = new THREE.Clock();
// animate
const animate = () => {
  requestAnimationFrame(animate);

  // raycaster.setFromCamera(pointer, camera);
  // const intersects = raycaster.intersectObjects(scene.children);
  // if (intersects.length > 0) {
  //   if (intersects[0].object.name === 'star1' && INTERSECTED != intersects[0].object) {
  //     if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
  //     INTERSECTED = intersects[0].object;
  //     INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
  //     INTERSECTED.material.emissive.setHex(0x00ffff);
  //   }
  // } else {
  //   if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
  //   INTERSECTED = null;
  // }

  // gsap.effects.float2([
  //   fishGroup1.children[0].children[0].material,
  //   fishGroup1.children[0].children[1].material,
  //   fishGroup1,
  // ]);

  // gsap.effects.float(fishGroup1);

  const delta = clock.getDelta();

  if (mixer) mixer.update(delta);
  if (mixerKoi) mixerKoi.update(delta);

  controls.update();
  // controls.update(clock.getDelta());

  renderer.render(scene, camera);
};

animate();
