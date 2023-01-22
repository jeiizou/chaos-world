import { Matrix4 } from '@/math-helper/matrix4';
import { Vector3Row, Vector4Row } from '@/math-helper/vector';
import { Scene2D } from '@/scene/2d/scene2D';
import { createBufferInfoFromArrays, drawBufferInfo, setBuffersAndAttributes, setUniforms } from 'twgl.js';
import ObjectBase from './object-base';

import { getProgramInfoM } from '@/shader/simple/program';

export class Polygon extends ObjectBase {
  private positionArray: Float32Array = new Float32Array([]);
  private colorArray: Float32Array = new Float32Array([]);

  constructor(positions: Vector3Row[], colors?: Vector4Row[], private type?: number) {
    super();
    let points = positions.reduce((l, r) => l.concat(r), [] as number[]);
    this.positionArray = new Float32Array(points);

    if (colors && colors.length === positions.length) {
      let colorArr: number[] = colors?.reduce((l, r) => l.concat(r), [] as number[]) ?? [];
      this.colorArray = new Float32Array(colorArr);
    } else {
      // default black
      const defaultColor = [0, 0, 0, 1];
      const colorArr: number[] = [];
      positions.forEach((_p, i) => {
        let curColor = colors?.[i] ?? defaultColor;
        colorArr.push(...curColor);
      });
      this.colorArray = new Float32Array(colorArr);
    }
  }

  draw(scene: Scene2D, uMatrix: Matrix4): void {
    const {
      lastUsedBufferInfo,
      lastUsedProgramInfo,
      context: gl,
      setLastUsedBufferInfo,
      setLastUsedProgramInfo,
    } = scene;
    const programInfo = getProgramInfoM(gl);
    const bufferInfo = createBufferInfoFromArrays(gl, {
      a_position: this.positionArray,
      a_color: this.colorArray,
    });
    const uniforms = {
      u_matrix: uMatrix.value,
      u_colorMulti: [1, 1, 1, 1],
    };
    let bindBuffers = false;
    if (programInfo !== lastUsedProgramInfo) {
      setLastUsedProgramInfo(programInfo);
      gl.useProgram(programInfo.program);
      bindBuffers = true;
    }
    if (bindBuffers || bufferInfo != lastUsedBufferInfo) {
      setLastUsedBufferInfo(bufferInfo);
      setBuffersAndAttributes(gl, programInfo, bufferInfo);
    }
    setUniforms(programInfo, uniforms);

    drawBufferInfo(gl, bufferInfo, this.type);
  }
}
