import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';
import { ContainerContext } from './container-context';
import { useEventEmitter, useSize } from 'ahooks';
import { styleMap } from '../../utils/just-js';
import { SizeType, SortCfgType, sortDomWithSize } from '../../utils/helper';

type ContainerProps = {
    children: ReactNode | ReactNode[];
    sortCfg?: SortCfgType;
};

export type WindowMapType = Record<
    string, // window key
    {
        title: string;
        visible: boolean;
        isRunning?: boolean;
        size?: SizeType;
    }
>;

export default function FreeLayoutComponent({
    children,
    sortCfg = {
        gutter: [8, 8],
    },
}: ContainerProps): React.ReactElement {
    // container states manager
    const layoutDom = useRef<HTMLDivElement>(null);
    const containerSize = useSize(layoutDom);
    const boundingBox = useMemo(() => {
        return [0, 0, containerSize?.width || 0, containerSize?.height || 0];
    }, [containerSize]);

    // container action
    const sortBoxers = () => {
        if (!containerSize) return;
        event$.emit({
            type: 'layout:sort',
            position: sortDomWithSize(
                zlevelArr,
                windowMap,
                containerSize,
                sortCfg,
            ),
        });
    };

    // windows states manager

    // window level
    const [zlevelArr, setZLevelArr] = useState<string[]>([]);
    // active window id
    const [activeWindowId, setActiveWindowId] = useState();
    // window information map
    const [windowMap, setWindowMap] = useState<WindowMapType>({});

    // event
    const event$ = useEventEmitter<{
        type: string;
        ev?: React.MouseEvent;
        [key: string]: any;
    }>();

    event$.useSubscription(val => {
        switch (val.type) {
            case 'win:regis':
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
                return;
            case 'win:focus':
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
                        map[val.id].visible = true;
                        return { ...map };
                    });
                }

                return;
            case 'win:resize':
                setWindowMap(map => {
                    map[val.id].size = val.size;
                    return { ...map };
                });
                return;
            case 'win:min':
                setWindowMap(map => {
                    map[val.id].visible = false;
                    return { ...map };
                });
                return;
            case 'win:close':
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
                return;
            default:
                break;
        }
    });

    const onMouseLeave = (ev: React.MouseEvent) => {
        event$.emit({
            type: 'leave',
            ev: ev,
        });
    };

    const onMouseMove = (ev: React.MouseEvent) => {
        event$.emit({
            type: 'moving',
            ev: ev,
        });
    };

    return (
        <ContainerContext.Provider
            value={{
                boundingBox,
                event: event$,
                zlevelArr,
                windowMap,
            }}>
            <div className={styles['free-layout__outer']}>
                <div className={styles['box__top-tool']}>
                    <button onClick={sortBoxers}>平铺</button>
                </div>
                <div
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    onMouseUp={onMouseLeave}
                    ref={layoutDom}
                    className={styles.box}>
                    {Array.isArray(children) ? <>{children}</> : children}
                </div>
                <div className={styles['free-layout__docker']}>
                    {Object.keys(windowMap).map(key => {
                        return (
                            <div
                                className={styleMap({
                                    [styles['free-layout__docker__item']]: true,
                                    [styles[
                                        'free-layout__docker__item--active'
                                    ]]: activeWindowId === key,
                                    [styles[
                                        'free-layout__docker__item--hidden'
                                    ]]: !windowMap[key].visible,
                                })}
                                key={key}
                                onClick={() => {
                                    event$?.emit({
                                        type: 'win:focus',
                                        id: key,
                                    });
                                }}>
                                {windowMap[key].title}
                            </div>
                        );
                    })}
                </div>
            </div>
        </ContainerContext.Provider>
    );
}
