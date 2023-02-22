import { CinoContext } from './cino-context';

export interface CinoConfig {
  mode: string;
}

const defaultCinoConfig = {
  mode: 'default',
};

export interface CinoAppConfig {
  /**
   * 应用名称
   */
  name: string;
  /**
   * 激活的钩子
   * @param context
   * @returns
   */
  onActivate: (context: CinoContext) => void;
  /**
   * 失活的钩子
   * @param context
   * @returns
   */
  onDeactivate?: (context: CinoContext) => void;
  /**
   * 安装以后初始化的钩子
   * @param context
   * @returns
   */
  onInitialize?: (context: CinoContext) => void;
}

export class Cino {
  constructor(config?: CinoConfig) {
    const lConfig = Object.assign({}, defaultCinoConfig, config);
  }

  /**
   * create app instance from createApp static method
   * @param config
   * @returns
   */
  static createApp(config: CinoAppConfig) {
    return config;
  }

  /**
   * install an application to cino
   */
  install() {}

  /**
   * uninstall an application from cino
   */
  uninstall() {}
}
