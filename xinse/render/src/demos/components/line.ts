import { create2DScene, Polygon } from '@/index';

export default function init(containerId: string) {
  const scene = create2DScene({
    refQuery: containerId
  });

  // 逆时针三角点
  const obj = new Polygon(
    [
      // line 1
      [0, 0.5, 0],
      [-0.5, 0, 0],
      // line 2
      [-0.5, 0, 0],
      [0.5, 0, 0],

      // line 3
      [0.5, 0, 0],
      [0, -0.5, 0],

      // line 4
      [0, -0.5, 0],
      [0, 0.5, 0]
    ],
    [
      // line color 1
      [0, 1, 1, 1],
      // line color 2
      [1, 0, 1, 1],
      [1, 1, 0, 1],
      // line color 3
      [1, 0, 0, 1],
      [0, 1, 0, 1],
      // line color 4
      [0, 0, 1, 1],
      [0, 1, 1, 1]
    ],
    scene.context.LINES
  );
  scene.addObjectToScene(obj);
  scene.render();
}
