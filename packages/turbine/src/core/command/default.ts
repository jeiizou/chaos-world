import { resizeCanvasToDisplaySize } from 'twgl.js';

export const runDefaultCommand = (gl: WebGL2RenderingContext | WebGLRenderingContext) => {
  // 设置视口
  resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);

  // reset viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 开启单面绘制
  gl.enable(gl.CULL_FACE);
  // 开启深度缓冲区
  gl.enable(gl.DEPTH_TEST);

  // clear
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
