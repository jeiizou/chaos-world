import React, { useEffect } from 'react';
import {
  Scene,
  Clock,
  WebGLRenderer,
  sRGBEncoding,
  PMREMGenerator,
  Color,
  PerspectiveCamera,
  AnimationMixer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import aModel from '../../assets/models/a.gltf';

export default function GlbSandBox(): React.ReactElement {
  useEffect(() => {
    let mixer: AnimationMixer;

    const clock = new Clock();
    const container = document.getElementById('container');

    if (!container) return;

    const renderer = new WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = sRGBEncoding;
    container.appendChild(renderer.domElement);

    const pmremGenerator = new PMREMGenerator(renderer);

    const scene = new Scene();
    scene.background = new Color(0xbfe3dd);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(5, 2, 8);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;

    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath('js/libs/draco/gltf/');

    const loader = new GLTFLoader();
    // loader.setDRACOLoader(dracoLoader);

    console.log('start load');
    loader.load(
      aModel,
      function (gltf) {
        console.log('loaded');
        const model = gltf.scene;
        model.position.set(1, 1, 0);
        model.scale.set(0.01, 0.01, 0.01);
        scene.add(model);

        mixer = new AnimationMixer(model);
        mixer.clipAction(gltf.animations[0]).play();

        animate();
      },
      undefined,
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

      const delta = clock.getDelta();

      mixer.update(delta);

      controls.update();

      renderer.render(scene, camera);
    }
  }, []);

  return <div id="container"></div>;
}
