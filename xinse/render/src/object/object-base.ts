import { Matrix4 } from '../math-helper/matrix4';
import { Scene2D } from '../scene/2d/scene2D';

abstract class ObjectBase {
  constructor() {}

  draw(_scene: Scene2D, _uMatrix: Matrix4) {}
}

export default ObjectBase;
