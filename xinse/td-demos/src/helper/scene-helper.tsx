import {
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  AmbientLight,
  PerspectiveCamera,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  SpotLight,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createScene(containerId: string) {
  const container = document.getElementById('container');
  if (!container) return;
  const renderer = new WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.toneMapping = ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new Scene();

  scene.add(new AmbientLight(0x443333));

  const spotLight = new SpotLight(0xffffff, 10);
  spotLight.position.set(25, 50, 25);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 100;
  scene.add(spotLight);

  const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(5, 2, 8);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  const loader = new GLTFLoader();

  return {
    renderer,
    scene,
  };
}
