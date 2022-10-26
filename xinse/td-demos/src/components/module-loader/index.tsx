import React, { useEffect, useRef, useState } from 'react';
import { createScene, enableSimpleSpotLight, loadGLTFModel } from '../../helper/scene-helper';

import styles from './index.module.scss';

export enum ModelType {
  GLTF = 'gltf',
}

type ModuleLoaderProps = {
  // 模型类型
  type: ModelType;
  // 模型数据源
  src: string;
  // 加载配置
  loadConfig?: any;
};

// TODO
export default function ModuleLoader({ type, src }: ModuleLoaderProps): React.ReactElement {
  const containerElement = useRef<HTMLDivElement>(null);
  const [sceneInfo, setSceneInfo] = useState<ReturnType<typeof createScene>>();
  const initFlag = useRef(false);
  const [loadingProcess, setLoadingProcess] = useState(0);

  useEffect(() => {
    if (initFlag.current) return;

    console.log('init scene');

    if (!containerElement.current) {
      return;
    }
    const sceneI = createScene(containerElement.current);
    sceneInfo?.render();

    sceneI?.scene && enableSimpleSpotLight(sceneI?.scene);
    const animate = () => {
      requestAnimationFrame(animate);
      sceneI?.render();
    };

    loadGLTFModel(src, (v) => {
      setLoadingProcess(v);
    }).then(({ model }) => {
      console.log('loaded');
      sceneI?.scene.add(model);
      animate();
    });

    initFlag.current = true;
  }, []);

  return (
    <>
      <div ref={containerElement}></div>
      {/* <div className={styles['loading-process']}>{loadingProcess}</div> */}
    </>
  );
}
