import { Matrix4 } from '@/math-helper/matrix4';
import { Vector2Row, Vector3Row, Vector4Row } from '@/math-helper/vector';
import { Scene2D } from '@/scene/2d/scene2D';
import { getProgramInfoM } from '@/shader/simple/program';
import { fillPointsToLines } from '@/utils/data-helper';
import { createBufferInfoFromArrays, drawBufferInfo, setBuffersAndAttributes, setUniforms } from 'twgl.js';
import ObjectBase from './object-base';

// export
export class Ellipse extends ObjectBase {
  private positionArray: Float32Array = new Float32Array([]);
  private colorArray: Float32Array = new Float32Array([]);

  constructor(
    position: Vector3Row,
    radiusPair: Vector2Row,
    sampleNumber: number = 150,
    colors?: Vector4Row[],
  ) {
    super();
    const xMin = position[0] - radiusPair[0];
    const xMax = position[0] + radiusPair[0];
    const stepLength = sampleNumber / 2;
    const step = (xMax - xMin) / (sampleNumber / 2);

    const positionArr: Vector3Row[] = [];

    const a = Math.pow(radiusPair[0], 2);
    const b = Math.pow(radiusPair[1], 2);

    for (let i = 0; i <= stepLength; i++) {
      const x = xMin + i * step;
      // x^2 / r1 + y^2 / r2 = 1 => y = sqrt((1 - x^2 / r1) * r2)
      const y = Math.sqrt((1 - Math.pow(x, 2) / a) * b);
      positionArr.push([x, y, 0]);

      if (i > 0 && i < stepLength) {
        positionArr.unshift([x, -y, 0]);
      }
    }

    const filledPositions = fillPointsToLines(positionArr);

    this.positionArray = new Float32Array(filledPositions.flat());

    if (colors && colors.length === sampleNumber) {
      let colorArr: number[] = colors?.reduce((l, r) => l.concat(r), [] as number[]) ?? [];
      this.colorArray = new Float32Array(colorArr);
    } else {
      // default black
      const defaultColor = [0, 0, 0, 1];
      const colorArr: number[] = [];
      for (let i = 0; i < filledPositions.length; i++) {
        let curColor = colors?.[i] ?? defaultColor;
        colorArr.push(...curColor);
      }
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

    drawBufferInfo(gl, bufferInfo, gl.LINES);
  }
}
