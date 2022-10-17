import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { AppInstance, AppType } from '../types';

export class Application {
    static createAppFromAppInstance(appIns: AppInstance) {
        return new Application(
            appIns.id,
            appIns.type,
            {
                name: appIns.name,
                icon: appIns.icon,
            },
            appIns.component,
        );
    }

    private loaded = false;

    constructor(
        public id: string,
        public type: AppType,
        public info: {
            name: string;
            icon?: string;
        },
        public component?: ReactNode,
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
