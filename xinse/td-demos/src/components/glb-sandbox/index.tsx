import React, { useEffect, useRef, useState } from 'react';
import {
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  AmbientLight,
  PerspectiveCamera,
  DirectionalLight,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
  SpotLight
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function loadModel(onLoading) {
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

  const dracoLoader = new DRACOLoader();

  dracoLoader.setDecoderConfig({ type: 'js' });
  dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/');

  loader.setDRACOLoader(dracoLoader);

  console.log('start load');
  const time = new Date().getTime();
  loader.load(
    '/dog.glb',
    function (gltf) {
      const loadedTime = new Date().getTime() - time;
      console.log('rendered', `cost ${loadedTime / 1000}s`);
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(0.1, 0.1, 0.1);
      scene.add(model);

      animate();
    },
    (xhr) => {
      onLoading((xhr.loaded / xhr.total) * 100);
    },
    function (e) {
      console.error(e);
    }
  );

  window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    const time = performance.now() / 1000;
    spotLight.position.x = Math.cos(time) * 45;
    spotLight.position.z = Math.sin(time) * 45;

    renderer.render(scene, camera);
  }
}

export default function GlbSandBox(): React.ReactElement {
  const init = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!init.current) {
      loadModel((v) => {
        setProgress(v);
      });
      init.current = true;
    }
  }, []);

  return (
    <>
      <div id="container"></div>
      <div style={{ position: 'absolute', top: 0, display: progress >= 100 ? 'none' : 'block' }}>
        loading{progress.toFixed(2)} %
      </div>
    </>
  );
}
