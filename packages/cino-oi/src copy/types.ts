import { ReactNode } from 'react';

/**
 * 应用类型
 */
export enum AppType {
  IframeApp = 0,
  ReactComponentApp = 1,
}

/**
 * 应用实例配置, 用于注册应用, 由应用提供, 暴露Cino需要的配置信息
 */
export interface AppInstance {
  /**
   * 应用ID, 需要全局唯一, 如不提供则由系统自动生成
   */
  id: string;
  /**
   * 应用名称
   */
  name: string;
  /**
   * 应用类型
   */
  type: AppType;
  /**
   * 应用图标
   */
  icon?: string;
}
