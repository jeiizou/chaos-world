// resource
declare module '*.fs';
declare module '*.vs';

type EnhanceAny = any;
type GLRendingContext = WebGL2RenderingContext | WebGLRenderingContext;

type color = [number, number, number, number];

interface I2DSceneConfig {
  container: string | HTMLElement | HTMLCanvasElement;
}

interface IScene2DConfig {
  clearColor: color;
}
