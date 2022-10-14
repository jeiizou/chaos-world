export interface AppInstance {
    id: string;
    name: string;
    icon?: string;
}

export interface DesktopInstance {
    install: (app: AppInstance) => void;
}
