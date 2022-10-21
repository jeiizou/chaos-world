import { create2DScene, Ellipse } from '../index';

const scene = create2DScene({
  container: '#demo3'
});
// 逆时针三角点
const obj = new Ellipse([0, 0, 0], [0.5, 0.5]);
scene.addObjectToScene(obj);
scene.render();
