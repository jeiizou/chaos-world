import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useEvent } from '@x-pro/cool-hook';
import { ContainerContext } from './container-context';
import { useSize } from 'ahooks';
import { styleMap } from '../../utils/just-js';

type ContainerProps = {
    children: ReactNode | ReactNode[];
    sortCfg?: {
        gutter: [number, number];
    };
};

export default function FreeLayoutComponent({
    children,
    sortCfg = {
        gutter: [8, 8],
    },
}: ContainerProps): React.ReactElement {
    // dom ref
    const layoutDom = useRef<HTMLDivElement>(null);
    const [zlevelArr, setZLevelArr] = useState<string[]>([]);
    const [activeWindowId, setActiveWindowId] = useState();
    const size = useSize(layoutDom);
    const [windowSizeMap, setWindowSizeMap] = useState<
        Record<
            string,
            {
                width: number;
                height: number;
            }
        >
    >({});
    const [windowArr, setWindowArr] = useState<
        Record<
            string,
            {
                title: string;
            }
        >
    >({});

    const event = useEvent<{
        type: string;
        ev?: React.MouseEvent;
        [key: string]: any;
    }>();

    event.useSubscription(val => {
        switch (val.type) {
            case 'win:regis':
                setZLevelArr(v => {
                    if (~v.indexOf(val.id)) {
                        return v;
                    }
                    v.push(val.id);
                    return [...v];
                });

                setWindowArr(map => {
                    map[val.id] = {
                        title: val.title,
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
                return;
            case 'win:resize':
                const { id, size } = val;
                if (size) {
                    setWindowSizeMap(map => {
                        map[id] = size;
                        return { ...map };
                    });
                }
                return;
            default:
                break;
        }
    });

    const onMouseLeave = (ev: React.MouseEvent) => {
        event.emit({
            type: 'leave',
            ev: ev,
        });
    };

    const onMouseMove = (ev: React.MouseEvent) => {
        event.emit({
            type: 'moving',
            ev: ev,
        });
    };

    const boundingBox = useMemo(() => {
        return [0, 0, size?.width || 0, size?.height || 0];
    }, [size]);

    const sortBoxers = () => {
        if (!size) return;

        let offsetX = 0;
        let offsetY = 0;

        const positionMap: Record<string, [number, number]> = {};
        zlevelArr.forEach(key => {
            if (!windowSizeMap[key]) return;
            const xEnd = offsetX + windowSizeMap[key].width + sortCfg.gutter[0];
            if (xEnd > size.width) {
                offsetX = 0;
                offsetY += windowSizeMap[key].height + sortCfg.gutter[1];
            }
            positionMap[key] = [offsetX, offsetY];
            offsetX = xEnd;
        });
        event.emit({
            type: 'layout:sort',
            position: positionMap,
        });
    };

    return (
        <ContainerContext.Provider
            value={{
                boundingBox,
                event,
                zlevelArr,
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
                    {Object.keys(windowArr).map(key => {
                        return (
                            <div
                                className={styleMap({
                                    [styles['free-layout__docker__item']]: true,
                                    [styles[
                                        'free-layout__docker__item--active'
                                    ]]: activeWindowId === key,
                                })}
                                key={key}
                                onClick={() => {
                                    event?.emit({
                                        type: 'win:focus',
                                        id: key,
                                    });
                                }}>
                                {windowArr[key].title}
                            </div>
                        );
                    })}
                </div>
            </div>
        </ContainerContext.Provider>
    );
}
