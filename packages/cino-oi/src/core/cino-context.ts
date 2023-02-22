import React from 'react';

export interface InterfaceConfig {
  /**
   * 窗口标题
   */
  title: string;
  /**
   * 窗口尺寸
   */
  size: Partial<{
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
  container: string | React.ReactNode | React.ReactElement;
}

export class CinoContext {
  // 创建一个窗口应用
  createInterFace(config: InterfaceConfig) {
    console.log(config);
  }
}
