import { useEffect } from 'react';
import { DesktopInstance } from '../types';

export function useDesktop(config: { desktopDefault: DesktopInstance }) {
    const desktop = {};

    return {
        desktop: desktop as DesktopInstance,
    };
}
