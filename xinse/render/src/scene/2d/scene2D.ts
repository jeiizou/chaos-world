import { ProgramInfo, resizeCanvasToDisplaySize } from 'twgl.js';
import CameraBase from '../../camera/camera-base';
import { Matrix4 } from '../../math-helper/matrix4';
import ObjectBase from '../../object/object-base';
import { XWarn } from '../../utils/logger';

export class Scene2D {
  constructor(
    private gl: GLRendingContext,
    // 场景配置属性
    private config: IScene2DConfig = {
      // 背景颜色
      clearColor: [1, 1, 1, 1]
    }
  ) {
    // 设置视口
    resizeCanvasToDisplaySize(this.gl.canvas);

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    // 开启单面绘制
    this.gl.enable(this.gl.CULL_FACE);
    // 开启深度缓冲区
    this.gl.enable(this.gl.DEPTH_TEST);

    // clear
    this.clear();
  }

  get context() {
    return this.gl;
  }

  clear() {
    this.gl.clearColor(...this.config.clearColor);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  // [about object] start =================================================
  private objectArray: ObjectBase[] = [];
  public addObjectToScene(object: ObjectBase) {
    this.objectArray.push(object);
  }
  public removeObjectFromScene(object: ObjectBase) {
    let index = this.objectArray.indexOf(object);
    if (~index) {
      this.objectArray.splice(index, 1);
    } else {
      XWarn('object is not exist in scene2D');
    }
  }
  // [about object] end =================================================

  // [about render] start =================================================
  lastUsedProgramInfo: ProgramInfo | null = null;
  lastUsedBufferInfo: WebGLBuffer | null = null;

  setLastUsedBufferInfo = (bufferINfo: WebGLBuffer) => {
    this.lastUsedBufferInfo = bufferINfo;
  };

  setLastUsedProgramInfo = (program: ProgramInfo) => {
    this.lastUsedProgramInfo = program;
  };

  render() {
    // render object to scene2D
    this.objectArray.forEach((obj) => {
      // get camera position
      let cameraMatrix = this.camera?.getMatrix() ?? Matrix4.identity();
      obj.draw?.(this, cameraMatrix);
    });
  }
  // [about render] end =================================================

  // [about camera] start =================================================
  camera: CameraBase | null = null;
  // 设置相机
  setCamera(camera: CameraBase) {
    this.camera = camera;
  }
  // [about camera] end =================================================
}
