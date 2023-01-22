import { XError } from '../utils/logger';

export type Vector2Row = [number, number];
export type Vector3Row = [number, number, number];
export type Vector4Row = [number, number, number, number];

export class Vector {
  static lengthEqual(vec1: Vector, vec2: Vector) {
    return vec1.length === vec2.length;
  }

  static add(v1: Vector, v2: Vector) {
    return new Vector(v1).add(v2);
  }

  static sub(v1: Vector, v2: Vector) {
    return new Vector(v1).sub(v2);
  }

  static multiNum(vec: Vector, num: number) {
    return new Vector(vec).multiNum(num);
  }

  static dot(v1: Vector, v2: Vector): number {
    return v1.dot(v2);
  }

  static distance(v1: Vector, v2: Vector): number {
    return v1.distance(v2);
  }

  static direction(v: Vector) {
    let newVec = new Vector(v);
    return newVec.multiNum(1 / newVec.norm());
  }

  /**
   * 向量归一化
   * @param v
   * @returns
   */
  static normalize(v: Vector) {
    return new Vector(v).normalize();
  }

  /**
   * 求v1在v2方向的投影
   * @param v1
   * @param v2
   * @returns
   */
  static orthProjection(v1: Vector, v2: Vector) {
    let u = Vector.direction(v1);
    return Vector.multiNum(u, Vector.dot(u, v2));
  }

  #data: Float32Array;

  constructor(...args: number[] | [Vector]) {
    let num1 = args[0];
    if (typeof num1 === 'number') {
      this.#data = new Float32Array(args as number[]);
    } else {
      this.#data = new Float32Array(num1.data);
    }
  }

  get length() {
    return this.#data?.length;
  }
  get data() {
    return this.#data;
  }

  set(data: number[] | Float32Array) {
    this.#data = new Float32Array(data);
  }

  lengthEqual(vec: Vector) {
    return this.length === vec.length;
  }

  /**
   * vec + vec
   * @param vec
   * @returns
   */
  add(vec: Vector) {
    if (!this.lengthEqual(vec)) {
      throw XError('vector length is not equal');
    }
    this.set(this.data.map((n, index) => n + vec.data[index]));
    return this;
  }

  /**
   * vec - vec
   * @param vec
   * @returns
   */
  sub(vec: Vector) {
    if (!this.lengthEqual(vec)) {
      throw XError('vector length is not equal');
    }

    this.set(this.data.map((n, index) => n - vec.data[index]));
    return this;
  }

  /**
   * vec * number
   * @param num
   * @returns
   */
  multiNum(num: number) {
    this.set(this.data.map((n) => n * num));
    return this;
  }

  /**
   * |vec|
   * @returns
   */
  norm() {
    return Math.sqrt(this.data.reduce((a, b) => a + b * b, 0));
  }

  /**
   * 获取向量的方向向量
   * @returns
   */
  direction() {
    return Vector.direction(this);
  }

  /**
   * vec * vec
   * @param vec
   * @returns
   */
  dot(vec: Vector) {
    if (!Vector.lengthEqual(this, vec)) {
      throw XError('vector length is not equal');
    }
    return this.data.reduce((a, b, index) => a + b * vec.data[index], 0);
  }

  distanceSq(vec: Vector) {
    return this.data.reduce((a, b, index) => a + (b - vec.data[index]) * (b - vec.data[index]), 0);
  }

  /**
   * 两个点的距离
   * @param vec
   * @returns
   */
  distance(vec: Vector) {
    return Math.sqrt(this.distanceSq(vec));
  }

  normalize() {
    this.set(this.data.map((n) => n / this.norm()));
    return this;
  }

  orthProjection(vec: Vector) {
    return Vector.orthProjection(this, vec);
  }
}

export class Vector3 extends Vector {
  /**
   * 向量叉乘
   * @param v1
   * @param v2
   * @returns
   */
  static cross(v1: Vector3, v2: Vector3) {
    let [x1, x2, x3] = v1.data;
    let [y1, y2, y3] = v2.data;

    return new Vector3(x2 * y3 - x3 * y2, x3 * y1 - x1 * y3, x1 * y2 - x2 * y1);
  }

  constructor(...args: Vector3Row | [Vector3]) {
    super(...args);
  }

  cross(vec: Vector3) {
    return Vector3.cross(this, vec);
  }
}

export class Vector4 extends Vector {
  constructor(...args: Vector4Row | [Vector4]) {
    super(...args);
  }
}

export class Vector2 extends Vector {
  constructor(...args: Vector2Row | [Vector2]) {
    super(...args);
  }
}
