import { CinoContext } from './cino-context';
import { CinoLog } from './cino-log';

export enum CinoAppStatus {
  original, // 初始状态
  initialized, // 已经被安装
  activate, // 激活中
  deactivate, // 休眠中
}

export interface CinoAppConfig {
  /**
   * 应用名称
   */
  name: string;
  /**
   * 应用ID, 全局唯一
   */
  id: string;
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

export class CinoApplication {
  private appConfig: CinoAppConfig;
  private appState: CinoAppStatus;

  constructor(config: CinoAppConfig) {
    this.appState = CinoAppStatus.original;
    this.appConfig = Object.assign({}, config);
  }

  getId() {
    return this.appConfig.id;
  }

  /**
   * activate self
   */
  activate(context: CinoContext) {
    if (this.appState === CinoAppStatus.activate) {
      CinoLog.warn('app is already activated');
      return;
    }

    this.appState = CinoAppStatus.activate;
    this.appConfig.onActivate?.(context);
  }

  /**
   * deactivate self
   */
  deactivate(context: CinoContext) {
    if (this.appState !== CinoAppStatus.activate) {
      CinoLog.warn('app is not activated');
      return;
    }

    this.appState = CinoAppStatus.deactivate;
    this.appConfig.onDeactivate?.(context);
  }

  /**
   * install app
   */
  install(context: CinoContext) {
    if (this.appState !== CinoAppStatus.original) {
      CinoLog.warn('app is not original');
      return;
    }

    this.appState = CinoAppStatus.initialized;
    this.appConfig.onInitialize?.(context);
  }
}
