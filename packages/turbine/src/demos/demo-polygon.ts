import { create2DScene, Polygon } from '../index';

const scene = create2DScene({
  refQuery: '#demo1',
});
// 逆时针三角点
const obj = new Polygon(
  [
    // 第一个三角形
    [0, 0.5, 0],
    [-0.5, 0, 0],
    [0.5, 0, 0],
    // 第二个三角形
    [-0.5, 0, 0],
    [0, -0.5, 0],
    [0.5, 0, 0],
  ],
  [
    // 第一个三角形的颜色
    [0, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 1, 0, 1],
    // 第二个三角形的颜色
    [1, 0, 0, 1],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
  ],
);
scene.addObjectToScene(obj);
scene.render();
