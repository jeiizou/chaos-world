import { CinoAppConfig, CinoApplication } from './cino-application';
import { CinoContext } from './cino-context';

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
    this.#context = new CinoContext();
  }

  /**
   * install an application to cino
   */
  install(app: CinoApplication) {
    // emit `activate` event
    app.install(this.#context);
    this.#apps.set(app.getId(), app);
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
}
