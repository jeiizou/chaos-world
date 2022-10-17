import { createModel } from '@jeiiz/ohooks';
import { useEventEmitter } from 'ahooks';
import { useRef, useState } from 'react';
import { Application } from '../domain/application';
import { Container } from '../domain/container';
import { SizeType, sortDomWithSize } from '../utils/helper';

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
        app: Application;
    }
>;

export const DESKTOP_CONFIG = {
    sortConfig: {
        gutter: [8, 8],
    },
};

export function useDesktopModel() {
    const containerDomain = useRef<Container>();

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

    const subscribe$ = (
        type: EVENT_TYPE,
        fn: (val?: Record<string, any>) => void,
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
        setZLevelArr(v => {
            if (~v.indexOf(val?.id)) {
                return v;
            }
            v.push(val?.id);
            return [...v];
        });
        setWindowMap(map => {
            map[val?.id] = {
                title: val?.title,
                visible: true,
            };
            return { ...map };
        });
    });

    subscribe$(EVENT_TYPE.WIN_FOCUS, val => {
        setZLevelArr(v => {
            let index = v.indexOf(val?.id);
            if (~index) {
                v.splice(index, 1);
                v.unshift(val?.id);
                setActiveWindowId(val?.id);
                return [...v];
            } else {
                return v;
            }
        });

        if (!windowMap[val?.id].visible) {
            setWindowMap(map => {
                if (map[val?.id]) {
                    map[val?.id].visible = true;
                }
                return { ...map };
            });
        }
    });

    // 窗口resize
    subscribe$(EVENT_TYPE.WIN_RESIZE, val => {
        setWindowMap(map => {
            if (map[val?.id]) {
                map[val?.id].size = val?.size;
            }
            return { ...map };
        });
    });

    // 窗口最小化
    subscribe$(EVENT_TYPE.WIN_MIN, val => {
        setWindowMap(map => {
            if (map[val?.id]) {
                map[val?.id].visible = false;
            }
            return { ...map };
        });
    });

    // 窗口关闭
    subscribe$(EVENT_TYPE.WIN_CLOSE, val => {
        setWindowMap(map => {
            delete map[val?.id];
            return { ...map };
        });

        setZLevelArr(v => {
            let index = v.indexOf(val?.id);
            if (~index) {
                v.splice(index, 1);
                return [...v];
            } else {
                return v;
            }
        });

        if (activeWindowId === val?.id) {
            setActiveWindowId(undefined);
        }
    });

    // 窗口排序
    subscribe$(EVENT_TYPE.BAR_SORT, () => {
        if (containerSize) {
            let positions = sortDomWithSize(
                zlevelArr,
                windowMap,
                containerSize,
                DESKTOP_CONFIG.sortConfig,
            );
            emit$(EVENT_TYPE.WIN_POSITION, { positions });
        }
    });

    // 画布点击
    subscribe$(EVENT_TYPE.CANVAS_CLICK, () => {
        setActiveWindowId(undefined);
    });

    subscribe$(EVENT_TYPE.APP_START, val => {
        if (!val) return;
        let app = containerDomain.current?.getAppById(val.id);
        if (!app) return;

        let loadFn = app.load();
        // setWindowMap(map=>{
        //     map[val.id])
        // })
        if (windowMap[val.id]) {
            // 已存在
            console.warn('application loaded');
        } else {
            // setWindowMap(map => {
            //     map[val.id] = {
            //         app: app,
            //         size: '',
            //     };
            //     return { ...map };
            // });
            // TODO: create a window
            console.log('create a window');
        }
    });

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

        containerDomain,
    };
}

export const DesktopModel = createModel(useDesktopModel);
