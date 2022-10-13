import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useMove } from '@jeiiz/ohooks';
import { styleMap } from '../../utils/just-js';
import { nanoid } from 'nanoid';
import { useDebounce, useSize } from 'ahooks';

import addSvg from '../../assets/add.svg';
import closeSvg from '../../assets/close.svg';
import minusSvg from '../../assets/minus.svg';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';

type WinProps = {
    children: ReactNode | ReactNode[];
    title?: string;
    defaultPosition?: [number, number];
};

export default function WindowComponent({
    children,
    defaultPosition = [0, 0],
    title,
}: WinProps): React.ReactElement {
    const {
        windowMap,
        containerSize,
        subscribe$,
        emit$,
        zlevelArr,
        activeWindowId,
    } = DesktopModel.useContext();

    // dom ref
    const domHandle = useRef<HTMLDivElement>(null);

    // state
    const [isMoving, setIsMoving] = useState(false);
    const size = useSize(domHandle);
    const debouncedSize = useDebounce(size, { wait: 200 });

    const id = useMemo(() => `${title}:${nanoid(6)}`, [title]);
    const windowInfo = useMemo(() => windowMap?.[id], [id, windowMap]);

    // hooks
    const {
        startMoving,
        moving,
        endMoving,
        position,
        setBoundingBox,
        setPosition,
    } = useMove({
        defaultPosition: defaultPosition,
    });

    // effects
    useEffect(() => {
        setBoundingBox([
            0,
            0,
            containerSize?.width ?? 0,
            containerSize?.height ?? 0,
        ]);
    }, [containerSize]);

    subscribe$(EVENT_TYPE.CANVAS_LEAVE, val => {
        setIsMoving(false);
        endMoving();
    });

    subscribe$(EVENT_TYPE.CANVAS_MOVING, val => {
        moving(val.ev);
    });

    subscribe$(EVENT_TYPE.WIN_SORT, val => {
        if (windowInfo && val) {
            const position = val.position[id];
            position && setPosition(position);
        }
    });

    // function
    const focusCurrent = () => {
        emit$(EVENT_TYPE.WIN_FOCUS, {
            id: id,
        });
    };

    const winLevel = useMemo(() => {
        let index = zlevelArr?.indexOf(id);
        if (~index) {
            return zlevelArr?.length - index;
        }
        return undefined;
    }, [zlevelArr, id]);

    useEffect(() => {
        setTimeout(() => {
            emit$(EVENT_TYPE.WIN_REGIS, {
                id: id,
                title: title,
            });
        }, 0);
    }, []);

    useEffect(() => {
        if (debouncedSize) {
            emit$(EVENT_TYPE.WIN_RESIZE, {
                id: id,
                size: { ...debouncedSize },
            });
        }
    }, [debouncedSize]);

    const max = () => {
        if (domHandle.current) {
            domHandle.current.style.width = `${
                containerSize?.width ?? 0 - 2
            }px`;
            domHandle.current.style.height = `${
                containerSize?.height ?? 0 - 2
            }px`;
            setPosition([0, 0]);
        }
    };

    const min = () => {
        emit$(EVENT_TYPE.WIN_MIN, { id });
    };

    const close = () => {
        emit$(EVENT_TYPE.WIN_CLOSE, { id });
    };

    return windowInfo ? (
        <div
            style={{
                left: position[0],
                top: position[1],
                zIndex: winLevel,
                maxWidth: (containerSize?.width ?? 0) - 2 || undefined,
                maxHeight: (containerSize?.height ?? 0) - 2 || undefined,
                display: windowInfo?.visible ? undefined : 'none',
            }}
            className={styleMap({
                [styles.win]: true,
                [styles.moving]: isMoving,
                [styles.active]: activeWindowId === id,
            })}
            ref={domHandle}
            onMouseUp={endMoving}
            onMouseDown={focusCurrent}>
            <div
                onMouseDown={e => {
                    setIsMoving(true);
                    startMoving?.(e);
                }}
                className={styles.winHeader}>
                <span>{title}</span>
                <span className={styles.winIconGroup}>
                    <span
                        style={{
                            backgroundColor: 'var(--success-light-color)',
                        }}
                        className={styles.winIconGroupItem}
                        onClick={max}>
                        <img src={addSvg} alt='' />
                    </span>
                    <span
                        style={{
                            backgroundColor: 'var(--warn-light-color)',
                        }}
                        className={styles.winIconGroupItem}
                        onClick={min}>
                        <img src={minusSvg} alt='' />
                    </span>
                    <span
                        style={{ backgroundColor: 'var(--error-light-color)' }}
                        className={styles.winIconGroupItem}
                        onClick={close}>
                        <img src={closeSvg} alt='' />
                    </span>
                </span>
            </div>
            <div className={styles.winBody}>
                {Array.isArray(children) ? <>{children}</> : children}
            </div>
        </div>
    ) : (
        <>unmounted</>
    );
}
