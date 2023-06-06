import { nanoid } from 'nanoid';
import { CinoEventsHandle, CinoEventsName, ViewInfo } from './cino.type';
import { CinoEventBus } from './cino-events';

export class CinoContext {
  private views: Map<string, ViewInfo> = new Map();

  constructor(private event: CinoEventBus<CinoEventsName, CinoEventsHandle>) {}

  public registerView(info: ViewInfo): void {
    const viewId = nanoid();
    this.views.set(`${info.appId}_${viewId}`, info);
    this.event.emit(CinoEventsName.RegisterView, {
      viewId,
      info,
    });
  }

  public getViewMap() {
    return this.views;
  }

  public getAllViewWithApp(appId: string) {
    return Object.values(this.views).filter((i) => i.appId === appId);
  }
}
