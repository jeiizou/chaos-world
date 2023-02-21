import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { AppInstance, AppType } from '../types';

export class Application {
  /**
   * 从应用配置创建应用实例
   */
  static createAppFromAppInstance(appIns: AppInstance) {
    return new Application(appIns.id, appIns.type, {
      // 应用信息
      name: appIns.name,
      icon: appIns.icon,
    });
  }

  private loaded = false;

  constructor(
    public id: string,
    public type: AppType,
    public info: {
      name: string;
      icon?: string;
    },
  ) {}

  loadResources() {
    switch (this.type) {
      case AppType.ReactComponentApp:
        return (boxDom: HTMLElement) => {
          return ReactDOM.createPortal(this.component, boxDom);
        };
    }
  }

  load() {
    let loadResFn = this.loadResources();

    return loadResFn;
  }
}
