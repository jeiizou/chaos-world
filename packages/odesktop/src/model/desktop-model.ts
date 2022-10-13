import { createModel } from '@jeiiz/ohooks';
import { useEventEmitter } from 'ahooks';
import { useState } from 'react';
import { SizeType } from '../utils/helper';

export enum EVENT_TYPE {
    WIN_REGIS = 'win_regis',
    WIN_SORT = 'win_sort',
    WIN_MIN = 'win_min',
    WIN_CLOSE = 'win_close',
    WIN_RESIZE = 'win_resize',
    WIN_FOCUS = 'win_focus',
    CANVAS_LEAVE = 'canvas_leave',
    CANVAS_MOVING = 'canvas_moving',
}

export type WindowMapType = Record<
    string, // window key
    {
        title: string;
        visible: boolean;
        isRunning?: boolean;
        size?: SizeType;
    }
>;

export const DESKTOP_CONFIG = {
    sortConfig: {
        gutter: [8, 8],
    },
};

export function useDesktop() {
    const event$ = useEventEmitter<{
        type: EVENT_TYPE;
        [key: string]: any;
    }>();

    const emit$ = (type: EVENT_TYPE, params: Record<string, any>) => {
        event$.emit({
            type,
            ...params,
        });
    };

    const subscribe$ = (
        type: EVENT_TYPE,
        fn: (val: Record<string, any>) => void,
    ) => {
        event$.useSubscription(val => {
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

    subscribe$(EVENT_TYPE.WIN_REGIS, val => {
        console.log('注册窗口', val);
        setZLevelArr(v => {
            if (~v.indexOf(val.id)) {
                return v;
            }
            v.push(val.id);
            return [...v];
        });
        setWindowMap(map => {
            map[val.id] = {
                title: val.title,
                visible: true,
            };
            return { ...map };
        });
    });

    subscribe$(EVENT_TYPE.WIN_SORT, val => {
        setZLevelArr(v => {
            let index = v.indexOf(val.id);
            if (~index) {
                v.splice(index, 1);
                v.unshift(val.id);
                setActiveWindowId(val.id);
                return [...v];
            } else {
                return v;
            }
        });

        if (!windowMap[val.id].visible) {
            setWindowMap(map => {
                if (map[val.id]) {
                    map[val.id].visible = true;
                }
                return { ...map };
            });
        }
    });

    // 窗口resize
    subscribe$(EVENT_TYPE.WIN_RESIZE, val => {
        setWindowMap(map => {
            if (map[val.id]) {
                map[val.id].size = val.size;
            }
            return { ...map };
        });
    });

    // 窗口最小化
    subscribe$(EVENT_TYPE.WIN_MIN, val => {
        setWindowMap(map => {
            if (map[val.id]) {
                map[val.id].visible = false;
            }
            return { ...map };
        });
    });

    // 窗口关闭
    subscribe$(EVENT_TYPE.WIN_CLOSE, val => {
        setWindowMap(map => {
            delete map[val.id];
            return { ...map };
        });

        setZLevelArr(v => {
            let index = v.indexOf(val.id);
            if (~index) {
                v.splice(index, 1);
                return [...v];
            } else {
                return v;
            }
        });

        if (activeWindowId === val.id) {
            setActiveWindowId(undefined);
        }
    });

    subscribe$(EVENT_TYPE.WIN_FOCUS, val => {});

    return {
        event$,
        emit$,
        subscribe$,
        DESKTOP_CONFIG,

        windowMap,
        activeWindowId,
        zlevelArr,

        containerSize,
        setContainerSize,
    };
}

export const DesktopModel = createModel(useDesktop);
