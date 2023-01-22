import { getContainer } from '@/utils';
import { SingleBase } from '@/utils/class-base';
import { getContext } from 'twgl.js';
import { runDefaultCommand } from './command/default';

export interface TurbineConfig extends SingleBase {
  refQuery: string | HTMLElement | HTMLCanvasElement;
}

/**
 * 核心绘制对象
 */
export class Turbine extends SingleBase {
  private gl: WebGL2RenderingContext | WebGLRenderingContext;

  constructor(config: TurbineConfig) {
    super(config);

    const { refQuery: container } = config;
    const canvas = getContainer(container);
    this.gl = getContext(canvas);

    // 载入默认配置
    runDefaultCommand(this.gl);
  }

  /**
   * 加载资源
   */
  resource() {}

  /**
   * 设置环境
   */
  command() {}

  /**
   * 绘制当前帧
   */
  render() {}
}
