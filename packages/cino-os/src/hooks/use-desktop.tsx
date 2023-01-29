import { useEffect } from 'react';
import { DesktopInstance } from '../types';

export function useDesktop(config?: { desktopDefault: DesktopInstance }) {
  const desktop = {
    install: () => {
      console.warn('not link to desktop');
    },
  };

  return {
    desktop: desktop as DesktopInstance,
  };
}
