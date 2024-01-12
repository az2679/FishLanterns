import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { gsap } from 'gsap';
import randomColor from 'randomcolor'; // https://github.com/davidmerfield/randomColor
import Stats from 'stats.js';

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

for (let i = 0; i < 10; i++) {
  let randomColL = randomColor({
    luminosity: 'light',
    hue: 'random',
  });
  let randomColR = randomColor({
    luminosity: 'light',
    hue: 'random',
  });
  const pointLight = new THREE.PointLight(randomColL, 10, 100);
  pointLight.position.set(-randomInt(150, 300), randomInt(100, 300), randomIntCondition(150, 300));
  scene.add(pointLight);
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
  // scene.add(pointLightHelper);

  const pointLightR = new THREE.PointLight(randomColR, 10, 100);
  pointLightR.position.set(randomInt(150, 300), randomInt(100, 300), randomIntCondition(150, 300));
  scene.add(pointLightR);
  // const pointLightHelperR = new THREE.PointLightHelper(pointLightR, 10);
  // scene.add(pointLightHelperR);
}

// perspective camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(0, 200, 400);
camera.lookAt(0, 200, 0);
scene.add(camera);

// control
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.enableRotate = true;
controls.rotateSpeed = 0.3;
controls.enableZoom = true;
controls.zoomSpeed = 0.5;
controls.minDistance = 10;
controls.maxDistance = 1000;

/*
////////////////////////////////////////////////////////////////////////////////
*/

// ground
const groundGeometry = new THREE.PlaneGeometry(10000, 10000);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xc1d3fe,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI * 0.5;
scene.add(groundMesh);

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
  return randomInt(min, max) * randomDirection();
}

gsap.registerEffect({
  name: 'float',
  extendTimeline: true,
  defaults: {
    duration: randomInt(45, 60),
  },
  effect: (targets, config) => {
    let tl = gsap.timeline({ repeat: -1 });
    // console.log(targets);

    tl.to(targets[0].position, { x: 800, duration: config.duration, ease: 'none' }, '-=1');

    // tl.to(targets[0].children[1].material, { opacity: 1, transparent: false, duration: 1, stagger: 7 })
    //   .to(targets[0].children[0].material, { opacity: 1, transparent: false, duration: 1, stagger: 7 }, '<')
    //   .to(targets[0].position, { x: 800, duration: config.duration, ease: 'none', stagger: 7 }, '-=1')
    //   .to(targets[0].children[1].material, { opacity: 0, transparent: true, duration: 1, stagger: 7 }, '-=2')
    //   .to(targets[0].children[0].material, { opacity: 0, transparent: true, duration: 1, stagger: 7 }, '<');
    return tl;
  },
});

/*                                               ASSET: FISH LANTERN + FLAME                                          */

//Fish Lantern with Flame
const fishLanternGroup = new THREE.Group();
let flameMixer;
loader.load(
  '/Fishv8.glb',

  function (gltf) {
    console.log(`Fish Lantern gltf: `, gltf);

    gltf.scene.position.set(0, 90, 0);
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.scale.setScalar(5);

    const fishLanternLight1 = new THREE.PointLight(0xffc8c8, 20, 150);
    // const fishLanternLightHelper1 = new THREE.PointLightHelper(fishLanternLight1, 10);
    // fishLanternGroup.add(fishLanternLightHelper1);

    const fishLanternLight2 = new THREE.PointLight(0x003566, 50, 175);
    // const fishLanternLightHelper2 = new THREE.PointLightHelper(fishLanternLight2, 10);
    // fishLanternGroup.add(fishLanternLightHelper2);

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
        flameMixer = new THREE.AnimationMixer(gltfFlame.scene);
        flameMixer.clipAction(gltfFlame.animations[0]).play();
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

//
//
//
/*                                               ASSET: MINI FISH LANTERN                                          */

loader.load('/Fishv8.glb', function (gltf) {
  gltf.scene.position.set(-randomInt(3, 4) * 150, randomInt(25, 300), randomIntCondition(150, 300));
  gltf.scene.rotation.y = Math.PI / 2;
  const randomNum = randomInt(2, 6) / 2;
  gltf.scene.scale.setScalar(randomNum);

  const fishLight = new THREE.PointLight(0xffc8c8, 50, 40);
  fishLight.position.set(0, 7, 2.5);
  gltf.scene.add(fishLight);
  gsap.effects.float(gltf.scene);
  gltf.scene.name = 'fish';
  fishLight.name = 'fishLight';
  // scene.add(gltf.scene);

  for (var i = 0; i < 15; i++) {
    let lanternClone = gltf.scene.clone();
    lanternClone.position.set(-randomInt(3, 4) * 200, randomInt(25, 300), randomIntCondition(150, 300));
    lanternClone.scale.setScalar(randomInt(2, 6) / 2);
    gsap.effects.float(lanternClone).delay(4 * i);
    scene.add(lanternClone);
  }

  // const geometry = gltf.scene.children[0].geometry.clone();
  // const material = gltf.scene.children[0].material;
  // const lanternIns = new THREE.InstancedMesh(geometry, material, 10);
  // scene.add(lanternIns);

  // const miniLanterns = new THREE.Object3D();
  // for (let i = 0; i < 10; i++) {
  //   miniLanterns.position.set(-randomInt(3, 4) * 200, randomInt(25, 300), randomIntCondition(150, 300));
  //   miniLanterns.scale.setScalar(randomInt(2, 6) / 2);
  //   miniLanterns.rotation.y = Math.PI / 2;
  //   // gsap.effects.float(miniLanterns).delay(5 * i);
  //   // gsap.effects.float(miniLanterns).delay(randomInt(0, 30));
  //   miniLanterns.updateMatrix();
  //   lanternIns.setMatrixAt(i, miniLanterns.matrix);
  //   // console.log(gsap.effects.float(miniLanterns));
  // }
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
      x: Math.PI * 2,
      // x: Math.PI * 0.1,
      duration: 60,
      repeat: -1,
      ease: 'power2.inOut',
    });
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
      if (el.isMesh) {
        el.material._transmission = 1;
        el.material.transparent = true;
        el.material.color.r = 0.925;
        el.material.color.g = 0.627;
        el.material.color.b = 1;
      }
    });

    gltf.scene.position.set(120, 125, 10);
    gltf.scene.scale.setScalar(0.15);
    gltf.scene.rotation.set(0, Math.PI / 4, -Math.PI / 8);
    roundLanternGroup.add(gltf.scene);

    const lanternLight = new THREE.PointLight(0xeca0ff, 20, 125);
    lanternLight.position.copy(gltf.scene.position);
    gltf.scene.add(lanternLight);

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

    let roundClone = gltf.scene.clone();
    roundClone.position.set(-150, 125, 10);

    gsap.to(roundLanternGroup.position, {
      y: 5,
      duration: 2,
      repeat: -1,
      ease: 'power2.inOut',
      yoyo: true,
    });
    gsap.to(roundClone.rotation, {
      x: randomInt(1, 3) / 10,
      y: randomInt(1, 3) / 10,
      z: randomInt(1, 2) / 10,
      duration: 3,
      repeat: -1,
      ease: 'power2.inOut',
      yoyo: true,
    });

    roundLanternGroup.add(roundClone);
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

//
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// resize
const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onResize);

// stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// animate
const clock = new THREE.Clock();
const animate = () => {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (flameMixer) flameMixer.update(delta);
  if (mixerKoi) mixerKoi.update(delta);

  controls.update();
  stats.update();

  // console.log(renderer.info.render.calls);
  renderer.render(scene, camera);
};

animate();
