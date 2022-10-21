/**
 * 矩阵的基类定义
 * | 1  2 |
 * | 3  4 |
 * 这样的矩阵, 表示为:
 * 传入参数为: new Matrix([1,2,3,4],2,2)
 */

import { XError } from '../utils/logger';
import { Vector } from './vector';

export class Matrix {
  static isEqualSize(left: Matrix, right: Matrix) {
    let [row1, col1] = left.size;
    let [row2, col2] = right.size;
    return row1 === row2 && col1 === col2;
  }

  static identity(row: number, col?: number) {
    return new Matrix([], row, col || row).setIdentity();
  }

  // 矩阵加法
  static add(left: Matrix, right: Matrix) {
    let result = new Matrix(left.value, left.size[0], left.size[1]);
    result.add(right);
    return result;
  }

  // 矩阵数乘
  static multiNum(left: Matrix, num: number) {
    let result = new Matrix(left.value, left.size[0], left.size[1]);
    result.multiNum(num);
    return result;
  }

  // 矩阵乘法
  static multiply(left: Matrix, right: Matrix) {
    let result = new Matrix(left.value, left.size[0], left.size[1]);
    result.multiply(right);
    return result;
  }

  constructor(protected data: number[], protected row: number, protected col: number) {
    // 没有传数据的时候, 默认设置为单位阵
    if (data.length < 1) {
      this.setIdentity();
    }
  }

  get size() {
    return [this.row, this.col];
  }

  get value() {
    return this.data;
  }

  /**
   * [row1,col2], 从0开始计数
   * @param rowNum
   * @param colNum
   */
  getValueByPosition(rowNum: number, colNum: number) {
    return this.data[rowNum * this.col + colNum];
  }

  setIdentity() {
    let result: number[] = [];
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        result.push(i === j ? 1 : 0);
      }
    }
    this.data = result;
    return this;
  }

  /**
   * matrix + matrix
   * @param mat
   * @returns
   */
  add(mat: Matrix) {
    if (!Matrix.isEqualSize(this, mat)) {
      throw XError('matrix is not same size');
    }
    let rightValue = mat.value;
    this.data = this.data.map((i, ids) => i + rightValue[ids]);
    return this;
  }

  /**
   * matrix * number
   * @param params
   */
  multiNum(params: number) {
    this.data = this.data.map((i) => i * params);
    return this;
  }

  /**
   * matrix * matrix
   */
  multiply(mat: Matrix) {
    let rightSize = mat.size;
    if (!(rightSize[0] === this.col)) {
      // 乘法非法
      throw XError('not validate matrix multiply');
    }
    let data = [];
    let m = this.row;
    let n = rightSize[1];
    let p = rightSize[0];
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        for (let k = 0; k < p; k++) {
          let val = this.getValueByPosition(i, k);
          let val2 = mat.getValueByPosition(k, j);
          if (data[i * m + j] === undefined) {
            data[i * m + j] = val * val2;
          } else {
            data[i * m + j] += val * val2;
          }
        }
      }
    }
    this.data = data;
    this.col = n;
    return this;
  }

  /**
   * matrix T
   */
  transpose() {
    let m = this.row;
    let n = this.col;
    let val = [];
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        val[j * m + i] = this.data[i * m + j];
      }
    }
    this.data = val;
    return this;
  }

  /**
   * matrix * vector
   * @param vec
   * @returns
   */
  multiVec(vec: Vector) {
    if (this.row !== vec.length) {
      throw XError('not validator matrix multi vec');
    }

    let dst = new Float32Array(4);
    for (var i = 0; i < 4; ++i) {
      dst[i] = 0.0;
      for (var j = 0; j < 4; ++j) {
        dst[i] += vec.data[j] * this.data[j * 4 + i];
      }
    }
    return new Vector(...dst);
  }
}
