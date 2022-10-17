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

    constructor(
        public id: string,
        public type: AppType,
        public info: {
            name: string;
            icon?: string;
        },
        public component?: ReactNode,
    ) {}

    load() {
        switch (this.type) {
            case AppType.ReactComponentApp:
                return (boxDom: HTMLElement) => {
                    ReactDOM.createPortal(this.component, boxDom);
                };
        }
    }
}
