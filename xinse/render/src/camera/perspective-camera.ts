import { Matrix4 } from '../math-helper/matrix4';
import { Vector3, Vector3Row } from '../math-helper/vector';
import CameraBase from './camera-base';

/**
 * 相机类
 */
export class PerspectiveCamera extends CameraBase {
  viewProjectionMatrix: Matrix4 = Matrix4.identity();
  constructor(config: {
    // 视角广度
    fov: number;
    // 视口宽高比
    aspect: number;
    // 近截面
    near: number;
    // 远截面
    far: number;
    // 相机位置
    position: Vector3Row;
    // 目标点
    target: Vector3Row;
    // 相机的上方向
    up: Vector3Row;
  }) {
    super();

    const projectionMatrix = new Matrix4().setPerspective(config.fov, config.aspect, config.near, config.far);

    const cameraMatrix = Matrix4.identity().setLookAt(
      new Vector3(...config.position),
      new Vector3(...config.target),
      new Vector3(...config.up)
    );

    const viewMatrix = cameraMatrix.inverse();

    const viewProjectionMatrix = Matrix4.multiply(viewMatrix, projectionMatrix) as Matrix4;

    this.viewProjectionMatrix = viewProjectionMatrix;
  }

  getMatrix() {
    return this.viewProjectionMatrix;
  }
}
