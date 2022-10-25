import React from 'react';

export enum ModelType {
  GLTF = 'gltf',
}

type ModuleLoaderProps = {
  // 模型类型
  type: ModelType;
  // 模型数据源
  src: string;
  // 加载配置
  loadConfig: any;
};

// TODO
export default function ModuleLoader({}: ModuleLoaderProps): React.ReactElement {
  return <div>模型加载器</div>;
}
