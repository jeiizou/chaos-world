import React from 'react';
import GlbSandBox from '../components/glb-sandbox';
import ModuleLoader, { ModelType } from '../components/module-loader';

type ModuleLoaderPageProps = {};

export default function ModuleLoaderPage({}: ModuleLoaderPageProps): React.ReactElement {
  return (
    <div>
      {/* <ModuleLoader type={ModelType.GLTF} src="/revenant_a_gaze_eternal_apex_legends_fandom.glb" /> */}
      <GlbSandBox />
    </div>
  );
}
