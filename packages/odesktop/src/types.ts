import { ReactNode } from 'react';

export enum AppType {
  ReactComponentApp = 'react-component-app'
}

export interface AppInstance {
  id: string;
  name: string;
  type: AppType;
  icon?: string;
  component?: ReactNode;
}

export interface DesktopApp {
  install: () => AppInstance;
}

export interface DesktopInstance {
  install: (app: DesktopApp) => void;
}
