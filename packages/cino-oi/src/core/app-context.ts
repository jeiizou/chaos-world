import { CinoApplication } from './cino-application';
import { CinoContext } from './cino-context';
import { ViewConfig } from './cino.type';

export class AppContext {
  self: CinoApplication;
  context: CinoContext;
  constructor(config: { self: CinoApplication; context: CinoContext }) {
    this.context = config.context;
    this.self = config.self;
  }

  /**
   * 创建一个窗口
   * @param vieConfig
   * @returns viewId
   */
  createView(vieConfig: ViewConfig) {
    return this.context.registerView({
      config: vieConfig,
      appId: this.self.getId(),
    });
  }

  // activeWindow(viewId: string) {

  // }
}
