import { XError } from '../utils/logger';
import { Matrix } from './matrix-base';
import { getRadiusFromAngle } from './utils';
import { Vector3 } from './vector';

export class Matrix4 extends Matrix {
  static getRotate(angle: number, x: number, y: number, z: number) {
    return new Matrix4().setRotate(angle, x, y, z);
  }

  static identity(): Matrix4 {
    return new Matrix4(Matrix.identity(4).value);
  }

  constructor(data?: number[]) {
    super(data ?? [], 4, 4);
  }

  /**
   * matrix4 ^ -1
   */
  inverse() {
    const dst = [];
    const m = this.value;

    let m00 = m[0 * 4 + 0];
    let m01 = m[0 * 4 + 1];
    let m02 = m[0 * 4 + 2];
    let m03 = m[0 * 4 + 3];
    let m10 = m[1 * 4 + 0];
    let m11 = m[1 * 4 + 1];
    let m12 = m[1 * 4 + 2];
    let m13 = m[1 * 4 + 3];
    let m20 = m[2 * 4 + 0];
    let m21 = m[2 * 4 + 1];
    let m22 = m[2 * 4 + 2];
    let m23 = m[2 * 4 + 3];
    let m30 = m[3 * 4 + 0];
    let m31 = m[3 * 4 + 1];
    let m32 = m[3 * 4 + 2];
    let m33 = m[3 * 4 + 3];
    let tmp_0 = m22 * m33;
    let tmp_1 = m32 * m23;
    let tmp_2 = m12 * m33;
    let tmp_3 = m32 * m13;
    let tmp_4 = m12 * m23;
    let tmp_5 = m22 * m13;
    let tmp_6 = m02 * m33;
    let tmp_7 = m32 * m03;
    let tmp_8 = m02 * m23;
    let tmp_9 = m22 * m03;
    let tmp_10 = m02 * m13;
    let tmp_11 = m12 * m03;
    let tmp_12 = m20 * m31;
    let tmp_13 = m30 * m21;
    let tmp_14 = m10 * m31;
    let tmp_15 = m30 * m11;
    let tmp_16 = m10 * m21;
    let tmp_17 = m20 * m11;
    let tmp_18 = m00 * m31;
    let tmp_19 = m30 * m01;
    let tmp_20 = m00 * m21;
    let tmp_21 = m20 * m01;
    let tmp_22 = m00 * m11;
    let tmp_23 = m10 * m01;

    let t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    let t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    let t2 = tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    let t3 = tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    dst[0] = d * t0;
    dst[1] = d * t1;
    dst[2] = d * t2;
    dst[3] = d * t3;
    dst[4] = d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    dst[5] = d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    dst[6] = d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    dst[7] = d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    dst[8] = d * (tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33 - (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    dst[9] = d * (tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33 - (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    dst[10] = d * (tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33 - (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    dst[11] = d * (tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23 - (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    dst[12] = d * (tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12 - (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    dst[13] = d * (tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22 - (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    dst[14] = d * (tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02 - (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    dst[15] = d * (tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12 - (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
    return new Matrix4(dst);
  }

  /**
   * 正交投影矩阵
   */
  setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    let e, rw, rh, rd;

    if (left === right || bottom === top || near === far) {
      throw XError('null frustum');
    }

    rw = 1 / (right - left);
    rh = 1 / (top - bottom);
    rd = 1 / (far - near);

    e = this.data;

    e[0] = 2 * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -2 * rd;
    e[11] = 0;

    e[12] = -(right + left) * rw;
    e[13] = -(top + bottom) * rh;
    e[14] = -(far + near) * rd;
    e[15] = 1;

    return this;
  }

  /**
   * 透视投影矩阵(六面定义)
   */
  setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number) {
    let e, rw, rh, rd;

    if (left === right || top === bottom || near === far) {
      throw XError('null frustum');
    }
    if (near <= 0) {
      throw XError('near <= 0');
    }
    if (far <= 0) {
      throw XError('far <= 0');
    }

    rw = 1 / (right - left);
    rh = 1 / (top - bottom);
    rd = 1 / (far - near);

    e = this.data;

    e[0] = 2 * near * rw;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * near * rh;
    e[6] = 0;
    e[7] = 0;

    e[8] = (right + left) * rw;
    e[9] = (top + bottom) * rh;
    e[10] = -(far + near) * rd;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = -2 * near * far * rd;
    e[15] = 0;

    return this;
  }

  /**
   * Set the perspective projection matrix by fovy and aspect.
   * @param fovy The angle between the upper and lower sides of the frustum.
   * @param aspect The aspect ratio of the frustum. (width/height)
   * @param near The distances to the nearer depth clipping plane. This value must be plus value.
   * @param far The distances to the farther depth clipping plane. This value must be plus value.
   * @return this
   */
  setPerspective(fovy: number, aspect: number, near: number, far: number) {
    if (near === far || aspect === 0) {
      throw XError('null frustum');
    }
    if (near <= 0) {
      throw XError('near <= 0');
    }
    if (far <= 0) {
      throw XError('far <= 0');
    }

    const fieldOfViewInRadians = getRadiusFromAngle(fovy);

    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    const dst = this.data;

    dst[0] = f / aspect;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 0;
    dst[5] = f;
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = (near + far) * rangeInv;
    dst[11] = -1;
    dst[12] = 0;
    dst[13] = 0;
    dst[14] = near * far * rangeInv * 2;
    dst[15] = 0;

    return this;
  }

  /**
   * 缩放矩阵
   * @param x: x轴 缩放比例
   * @param y: y轴 缩放比例
   * @param z: z轴 缩放比例
   */
  setScale(x: number, y: number, z: number) {
    let e = this.data;

    e[0] = x;
    e[4] = 0;
    e[8] = 0;
    e[12] = 0;

    e[1] = 0;
    e[5] = y;
    e[9] = 0;
    e[13] = 0;

    e[2] = 0;
    e[6] = 0;
    e[10] = z;
    e[14] = 0;

    e[3] = 0;
    e[7] = 0;
    e[11] = 0;
    e[15] = 1;

    return this;
  }

  /**
   * 在当前矩阵上缩放
   */
  scale(x: number, y: number, z: number) {
    var e = this.data;
    e[0] *= x;
    e[4] *= y;
    e[8] *= z;

    e[1] *= x;
    e[5] *= y;
    e[9] *= z;

    e[2] *= x;
    e[6] *= y;
    e[10] *= z;

    e[3] *= x;
    e[7] *= y;
    e[11] *= z;

    return this;
  }

  /**
   * 设置平移矩阵
   * @param x
   * @param y
   * @param z
   * @returns
   */
  setTranslate(x: number, y: number, z: number) {
    var e = this.data;
    e[0] = 1;
    e[4] = 0;
    e[8] = 0;
    e[12] = x;

    e[1] = 0;
    e[5] = 1;
    e[9] = 0;
    e[13] = y;

    e[2] = 0;
    e[6] = 0;
    e[10] = 1;
    e[14] = z;

    e[3] = 0;
    e[7] = 0;
    e[11] = 0;
    e[15] = 1;

    return this;
  }

  /**
   * 在当前矩阵上平移
   * @param x
   * @param y
   * @param z
   * @returns
   */
  translate(x: number, y: number, z: number) {
    let e = this.data;
    e[12] += e[0] * x + e[4] * y + e[8] * z;
    e[13] += e[1] * x + e[5] * y + e[9] * z;
    e[14] += e[2] * x + e[6] * y + e[10] * z;
    e[15] += e[3] * x + e[7] * y + e[11] * z;
    return this;
  }

  /**
   * 设置旋转矩阵
   * @param angle 旋转角度
   * @param x 旋转轴向量的x值
   * @param y 旋转轴向量的y值
   * @param z 旋转轴向量的z值
   */
  setRotate(angle: number, x: number, y: number, z: number) {
    let e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

    angle = (Math.PI * angle) / 180;
    e = this.data;

    s = Math.sin(angle);
    c = Math.cos(angle);

    if (0 !== x && 0 === y && 0 === z) {
      // Rotation around X axis
      if (x < 0) {
        s = -s;
      }
      e[0] = 1;
      e[4] = 0;
      e[8] = 0;
      e[12] = 0;
      e[1] = 0;
      e[5] = c;
      e[9] = -s;
      e[13] = 0;
      e[2] = 0;
      e[6] = s;
      e[10] = c;
      e[14] = 0;
      e[3] = 0;
      e[7] = 0;
      e[11] = 0;
      e[15] = 1;
    } else if (0 === x && 0 !== y && 0 === z) {
      // Rotation around Y axis
      if (y < 0) {
        s = -s;
      }
      e[0] = c;
      e[4] = 0;
      e[8] = s;
      e[12] = 0;
      e[1] = 0;
      e[5] = 1;
      e[9] = 0;
      e[13] = 0;
      e[2] = -s;
      e[6] = 0;
      e[10] = c;
      e[14] = 0;
      e[3] = 0;
      e[7] = 0;
      e[11] = 0;
      e[15] = 1;
    } else if (0 === x && 0 === y && 0 !== z) {
      // Rotation around Z axis
      if (z < 0) {
        s = -s;
      }
      e[0] = c;
      e[4] = -s;
      e[8] = 0;
      e[12] = 0;
      e[1] = s;
      e[5] = c;
      e[9] = 0;
      e[13] = 0;
      e[2] = 0;
      e[6] = 0;
      e[10] = 1;
      e[14] = 0;
      e[3] = 0;
      e[7] = 0;
      e[11] = 0;
      e[15] = 1;
    } else {
      // Rotation around another axis
      len = Math.sqrt(x * x + y * y + z * z);
      if (len !== 1) {
        rlen = 1 / len;
        x *= rlen;
        y *= rlen;
        z *= rlen;
      }
      nc = 1 - c;
      xy = x * y;
      yz = y * z;
      zx = z * x;
      xs = x * s;
      ys = y * s;
      zs = z * s;

      e[0] = x * x * nc + c;
      e[1] = xy * nc + zs;
      e[2] = zx * nc - ys;
      e[3] = 0;

      e[4] = xy * nc - zs;
      e[5] = y * y * nc + c;
      e[6] = yz * nc + xs;
      e[7] = 0;

      e[8] = zx * nc + ys;
      e[9] = yz * nc - xs;
      e[10] = z * z * nc + c;
      e[11] = 0;

      e[12] = 0;
      e[13] = 0;
      e[14] = 0;
      e[15] = 1;
    }

    return this;
  }

  /**
   * 在当前矩阵上进行旋转
   * @param angle
   * @param x
   * @param y
   * @param z
   */
  rotate(angle: number, x: number, y: number, z: number) {
    this.multiply(new Matrix4().setRotate(angle, x, y, z));
    return this;
  }

  /**
   * 设置观察矩阵
   * @param param0
   * @param param1
   * @param param2
   * @returns
   */
  setLookAt(cameraPosition: Vector3, target: Vector3, up: Vector3) {
    var zAxis = Vector3.normalize(Vector3.sub(cameraPosition, target)) as Vector3;
    var xAxis = Vector3.normalize(Vector3.cross(up, zAxis)) as Vector3;
    var yAxis = Vector3.normalize(Vector3.cross(zAxis, xAxis)) as Vector3;

    const dst = this.data;

    dst[0] = xAxis.data[0];
    dst[1] = xAxis.data[1];
    dst[2] = xAxis.data[2];
    dst[3] = 0;
    dst[4] = yAxis.data[0];
    dst[5] = yAxis.data[1];
    dst[6] = yAxis.data[2];
    dst[7] = 0;
    dst[8] = zAxis.data[0];
    dst[9] = zAxis.data[1];
    dst[10] = zAxis.data[2];
    dst[11] = 0;
    dst[12] = cameraPosition.data[0];
    dst[13] = cameraPosition.data[1];
    dst[14] = cameraPosition.data[2];
    dst[15] = 1;

    return this;
  }

  /**
   * 在当前矩阵上设置观察矩阵
   * @param eyeVec
   * @param centerVec
   * @param upVec
   * @returns
   */
  lookAt(eyeVec: Vector3, centerVec: Vector3, upVec: Vector3) {
    return this.multiply(new Matrix4().setLookAt(eyeVec, centerVec, upVec));
  }
}
