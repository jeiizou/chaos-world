import { AppContext } from './app-context';
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
   * 配置项
   */
  config: {
    icon?: {
      src?: '';
    };
    /**
     * 启动相关配置
     */
    boot?: {
      /**
       * 启动类型
       */
      type: 'docker';
      /**
       * 该启动类型的其他配置项
       */
      [key: string]: any;
    }[];
  };

  /**
   * 应用的静态钩子
   */

  /**
   * 激活的钩子
   * @param context
   * @returns
   */
  onActivate: (context: AppContext) => void;
  /**
   * 失活的钩子
   * @param context
   * @returns
   */
  onDeactivate?: (context: AppContext) => void;
  /**
   * 安装以后初始化的钩子
   * @param context
   * @returns
   */
  onInitialize?: (context: AppContext) => void;
  /**
   * 剩余参数
   */
  [key: string]: any;
}

export class CinoApplication {
  private appConfig: CinoAppConfig;
  private appState: CinoAppStatus;
  private appContext: AppContext | undefined;

  constructor(config: CinoAppConfig) {
    this.appState = CinoAppStatus.original;
    this.appConfig = Object.assign({}, config);
  }

  get name() {
    return this.appConfig.name;
  }

  get status() {
    return this.appState;
  }

  getId() {
    return this.appConfig.id;
  }

  getConfig() {
    return this.appConfig.config;
  }

  /**
   * install app
   */
  install(context: CinoContext) {
    if (this.appState !== CinoAppStatus.original) {
      CinoLog.warn('app is not original');
      return;
    }

    // init app stats and others
    this.appState = CinoAppStatus.initialized;
    this.appContext = new AppContext({
      self: this,
      context,
    });

    // init app-context
    // emit hooks
    this.appConfig.onInitialize?.(this.appContext);
  }

  /**
   * activate self
   */
  activate() {
    if (this.appState === CinoAppStatus.activate) {
      CinoLog.warn('app is already activated');
      return;
    }

    this.appState = CinoAppStatus.activate;

    if (!this.appContext) {
      CinoLog.warn('app is not installed');
      return;
    }

    this.appConfig.onActivate?.(this.appContext);
  }

  /**
   * deactivate self
   */
  deactivate() {
    if (this.appState !== CinoAppStatus.activate) {
      CinoLog.warn('app is not activated');
      return;
    }

    this.appState = CinoAppStatus.deactivate;

    if (!this.appContext) {
      CinoLog.warn('app is not installed');
      return;
    }

    this.appConfig.onDeactivate?.(this.appContext);
  }

  /**
   * 获取当前app的所有view
   * @returns
   */
  getViews() {
    return this.appContext?.context.getAllViewWithApp(this.getId());
  }
}
