import { createModel } from '@/ui/hooks/basic/use-model';
import { useEventEmitter } from 'ahooks';
import { useState } from 'react';

export enum EVENT_TYPE {
  WIN_REGIS = 'win_regis',
  WIN_POSITION = 'win_position',
  WIN_MIN = 'win_min',
  WIN_CLOSE = 'win_close',
  WIN_RESIZE = 'win_resize',
  WIN_FOCUS = 'win_focus',
  CANVAS_LEAVE = 'canvas_leave',
  CANVAS_MOVING = 'canvas_moving',
  CANVAS_CLICK = 'canvas_click',
  BAR_SORT = 'bar_sort',
  BOOT_START = 'boot_start',
  APP_START = 'app_start',
  APP_INSTALLED = 'app_installed',
}

export type WindowMapType = Record<
  string, // window key
  {
    visible: boolean;
    size?: SizeType;
  }
>;

export const DESKTOP_CONFIG = {
  sortConfig: {
    gutter: [8, 8],
  },
};

function useWindowModel() {
  const event$ = useEventEmitter<{
    type: EVENT_TYPE;
    [key: string]: any;
  }>();

  const emit$ = (type: EVENT_TYPE, params: Record<string, any> = {}) => {
    event$.emit({
      type,
      ...params,
    });
  };

  const subscribe$ = (type: EVENT_TYPE, fn: (val?: Record<string, any>) => void) => {
    event$.useSubscription((val) => {
      if (val.type === type) {
        fn?.(val);
      }
    });
  };

  // window level array
  const [zlevelArr, setZLevelArr] = useState<string[]>([]);
  // active window id
  const [activeWindowId, setActiveWindowId] = useState();
  // window information map
  const [windowMap, setWindowMap] = useState<WindowMapType>({});
  const [containerSize, setContainerSize] = useState<SizeType>();

  return {
    emit$,
    subscribe$,
    containerSize,
    setContainerSize,
    activeWindowId,
    setActiveWindowId,
    zlevelArr,
  };
}

export const WindowModel = createModel(useWindowModel);
