import { create2DScene, Ellipse } from '@/index';

export default function init(containerId: string) {
  const scene = create2DScene({
    refQuery: containerId,
  });
  // 逆时针三角点
  const obj = new Ellipse([0, 0, 0], [0.5, 0.5]);
  scene.addObjectToScene(obj);
  scene.render();
}
