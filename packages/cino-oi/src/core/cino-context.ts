import { nanoid } from 'nanoid';
import { CinoEventsHandle, CinoEventsName, ViewInfo } from './cino.type';
import { CinoEventBus } from './cino-events';

export class CinoContext {
  private views: Map<string, ViewInfo> = new Map();

  constructor(private event: CinoEventBus<CinoEventsName, CinoEventsHandle>) {}

  public getEvent() {
    return this.event;
  }

  public registerView(info: ViewInfo): string {
    const viewId = `${info.appId}_${nanoid()}`;
    this.views.set(viewId, info);
    this.event.emit(CinoEventsName.RegisterView, {
      viewId,
      info,
    });
    return viewId;
  }

  public getViewMap() {
    return this.views;
  }

  /**
   * TODO: 获取到的views有问题
   * @param appId
   * @returns
   */
  public getAllViewWithApp(appId: string) {
    const thisAppView: Record<string, ViewInfo> = {};
    for (const key of Object.keys(this.views)) {
      const view = this.views.get(key);
      if (view?.appId === appId) {
        thisAppView[key] = view;
      }
    }
    return thisAppView;
  }
}
