import { XError } from '@/utils/logger';
import * as twgl from 'twgl.js';
import { Scene2D } from './2d/scene2D';

interface I2DSceneConfig {
  container: string | HTMLElement | HTMLCanvasElement;
}

function getContainer(container: I2DSceneConfig['container']): HTMLCanvasElement {
  if (typeof container === 'string') {
    if (!document) {
      throw XError('no document object in environment');
    }
    return document.querySelector(container) as HTMLCanvasElement;
  } else {
    return container as HTMLCanvasElement;
  }
}

/**
 * 创建一个平面场景
 * @param config
 * @returns
 */
export function create2DScene(config: I2DSceneConfig) {
  const { container } = config;
  const canvas = getContainer(container);
  const gl = twgl.getContext(canvas);
  return new Scene2D(gl);
}
