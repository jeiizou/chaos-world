import { nanoid } from 'nanoid';
import { ViewInfo } from './cino.type';

export class CinoContext {
  private views: Map<string, ViewInfo> = new Map();

  public registerView(info: ViewInfo): void {
    const viewId = nanoid();
    this.views.set(`${info.appId}_${viewId}`, info);
  }

  public getViewMap() {
    return this.views;
  }

  public getAllViewWithApp(appId: string) {
    return Object.values(this.views).filter((i) => i.appId === appId);
  }
}
