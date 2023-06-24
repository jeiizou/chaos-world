import { CinoApplication } from './cino-application';

export interface CinoAppInfo {
  /**
   * 应用名称
   */
  name: string;
  /**
   * 应用ID, 唯一值, 可选
   */
  id?: string;
  /**
   * 资源地址
   */
  source: string;
}

export interface ViewConfig {
  /**
   * 窗口标题
   */
  title: string;
  /**
   * 窗口尺寸
   */
  size?: Partial<{
    width: string | number;
    height: string | number;
    maxWidth: string | number;
    maxHeight: string | number;
    minWidth: string | number;
    minHeight: string | number;
  }>;
  /**
   * 容器
   */
  container?: string | React.ReactNode | React.ReactElement;
  /**
   * 渲染类型
   */
  renderType?: 'iframe' | 'html' | 'react' | 'micro-app';
  /**
   * iframe 类型下的数据源
   */
  url?: string;
}

export interface ViewInfo {
  config: ViewConfig;
  appId: string;
}

export enum CinoEventsName {
  /**
   * 应用被安装
   */
  AppInstall = 'app-install',
  /**
   * 注册了一个新的视口
   */
  RegisterView = 'register-view',
}

export interface CinoEventsHandle {
  [CinoEventsName.AppInstall]: (params: { id: string; app: CinoApplication }) => void;
  [CinoEventsName.RegisterView]: (params: { viewId: string; info: ViewInfo }) => void;
}
