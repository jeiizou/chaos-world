import { AppInstance } from '../types';
import { Application } from './application';

export class Container {
    private static instance: Container;
    static getInstance(): Container {
        if (!Container.instance) {
            this.instance = new Container();
        }
        return this.instance;
    }

    private appMap: Map<string, Application> = new Map();

    constructor() {}

    async install(app: Application): Promise<boolean> {
        let isInstalled = this.appMap.has(app.id);
        if (isInstalled) {
            console.warn('Application already installed or ID duplicated');
            return false;
        }

        this.appMap.set(app.id, app);
        return true;
    }

    getAppsSnapShot() {
        return this.appMap;
    }

    getAppById(id: string) {
        let isInstalled = this.appMap.has(id);
        if (!isInstalled) {
            console.warn('Application is not installed');
            return null;
        }
        return this.appMap.get(id);
    }
}
