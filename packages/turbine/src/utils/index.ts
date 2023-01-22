import { XError } from './logger';

export function getContainer(container: string | HTMLElement | HTMLCanvasElement): HTMLCanvasElement {
  if (typeof container === 'string') {
    if (!document) {
      throw XError('no document object in environment');
    }
    return document.querySelector(container) as HTMLCanvasElement;
  } else {
    return container as HTMLCanvasElement;
  }
}
