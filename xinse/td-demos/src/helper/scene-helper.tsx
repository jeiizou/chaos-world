import {
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  AmbientLight,
  PerspectiveCamera,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  SpotLight,
  Group,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createScene(container: HTMLDivElement) {
  if (!container) return;
  const renderer = new WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  // renderer.toneMapping = ACESFilmicToneMapping;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const scene = new Scene();

  const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
  camera.position.set(5, 2, 8);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.5, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  function render() {
    controls.update();
    renderer.render(scene, camera);
  }

  return {
    renderer,
    scene,
    controls,
    camera,
    render,
  };
}

/**
 * 一个简单的点光源
 * @param scene
 */
export function enableSimpleSpotLight(scene: Scene) {
  let ambientLight = new AmbientLight(0xffffff);
  scene.add(ambientLight);

  const spotLight = new SpotLight(0xffffff, 10);
  spotLight.position.set(25, 50, 25);
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 2;
  spotLight.distance = 100;
  scene.add(spotLight);

  return {
    spotLight,
    ambientLight,
  };
}

export function loadGLTFModel(
  modelPath: string,
  onLoading: (v: number) => void,
): Promise<{
  model: Group;
  time: number;
}> {
  const loader = new GLTFLoader();
  // const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderConfig({ type: 'js' });
  // dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');
  // loader.setDRACOLoader(dracoLoader);
  return new Promise((res, rej) => {
    const time = new Date().getTime();
    loader.load(
      modelPath,
      function (gltf) {
        const loadedTime = new Date().getTime() - time;
        const model = gltf.scene;
        model.position.set(-5, -6, -1);
        model.scale.set(0.2, 0.2, 0.2);
        res({
          model,
          time: loadedTime,
        });
      },
      (xhr) => {
        onLoading((xhr.loaded / xhr.total) * 100);
      },
      function (e) {
        rej(e);
      },
    );
  });
}
