import { Matrix4 } from '../math-helper/matrix4';

abstract class CameraBase {
  viewProjectionMatrix: Matrix4 = Matrix4.identity();
  constructor() {}
  getMatrix(): Matrix4 {
    return this.viewProjectionMatrix;
  }
}

export default CameraBase;
