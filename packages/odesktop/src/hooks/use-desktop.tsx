import { DesktopInstance } from '../types';

export function useDesktop() {
    const desktop = {};

    return {
        desktop: desktop as DesktopInstance,
    };
}
