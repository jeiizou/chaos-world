import { CinoAppConfig, CinoApplication } from './cino-application';
import { CinoContext } from './cino-context';
import { CinoEventBus } from './cino-events';
import { CinoEventsHandle, CinoEventsName } from './cino.type';

export interface CinoConfig {
  mode: string;
}

const defaultCinoConfig = {
  mode: 'default',
};

export class Cino {
  #apps: Map<string, CinoApplication> = new Map();
  #config: CinoConfig;
  #context: CinoContext;
  #event: CinoEventBus<CinoEventsName, CinoEventsHandle>;

  /**
   * cino single-mode instance object
   */
  static instance: Cino;
  static getInstance(config?: CinoConfig) {
    if (!this.instance) {
      this.instance = new Cino(config);
    }
    return this.instance;
  }

  /**
   * create app instance from createApp static method
   * @param config
   * @returns
   */
  static createApp(config: CinoAppConfig) {
    const app = new CinoApplication(config);
    return app;
  }

  constructor(config?: CinoConfig) {
    this.#config = Object.assign({}, defaultCinoConfig, config);
    this.#event = new CinoEventBus();
    this.#context = new CinoContext(this.#event);
  }

  /**
   * install an application to cino
   */
  install(app: CinoApplication) {
    // emit `activate` event
    const appId = app.getId();
    app.install(this.#context);
    this.#apps.set(appId, app);
    this.#event.emit(CinoEventsName.AppInstall, {
      id: appId,
      app,
    });
  }

  /**
   * uninstall an application from cino
   */
  uninstall(appId: string) {
    const app = this.#apps.get(appId);
    // emit `deactivate` event
    app?.deactivate();
    this.#apps.delete(appId);
  }

  getViews() {
    return this.#context.getViewMap();
  }

  getApps() {
    return this.#apps;
  }

  getEvents() {
    return this.#event;
  }

  get events() {
    return this.#event;
  }
}
