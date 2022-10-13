import React, {
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import styles from './index.module.scss';
import { useMove } from '@x-pro/cool-hook';
import { ContainerContext } from '../free-layout/container-context';
import { styleMap } from '../../utils/just-js';
import { nanoid } from 'nanoid';
import { useDebounce, useSize } from 'ahooks';

import addSvg from '../../assets/add.svg';
import closeSvg from '../../assets/close.svg';
import minusSvg from '../../assets/minus.svg';

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
    // dom ref
    const domHandle = useRef<HTMLDivElement>(null);
    // context
    const {
        boundingBox,
        event$,
        zlevelArr = [],
        windowMap,
        activeWindowId,
    } = useContext(ContainerContext);
    // state
    const [isMoving, setIsMoving] = useState(false);

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

    const size = useSize(domHandle);
    const debouncedSize = useDebounce(size, { wait: 200 });

    // effects
    useEffect(() => {
        // set move position
        setBoundingBox([
            boundingBox[0] - (debouncedSize?.width || 0),
            boundingBox[1] - (debouncedSize?.height || 0),
            boundingBox[2],
            boundingBox[3],
        ]);
    }, [boundingBox, debouncedSize]);

    event$?.useSubscription(val => {
        switch (val.type) {
            case 'leave':
                setIsMoving(false);
                endMoving();
                break;
            case 'moving':
                moving(val.ev);
                break;
            case 'layout:sort':
                const position = val.position[id];
                position && setPosition(position);
            default:
                break;
        }
    });

    // function
    const focusCurrent = () => {
        event$?.emit({
            type: 'win:focus',
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
            event$?.emit({
                type: 'win:regis',
                id: id,
                title: title,
            });
        }, 0);
    }, []);

    useEffect(() => {
        if (debouncedSize) {
            event$?.emit({
                type: 'win:resize',
                id: id,
                size: { ...debouncedSize },
            });
        }
    }, [debouncedSize]);

    const max = () => {
        if (domHandle.current) {
            domHandle.current.style.width = `${boundingBox[2] - 2}px`;
            domHandle.current.style.height = `${boundingBox[3] - 2}px`;
            setPosition([0, 0]);
        }
    };

    const min = () => {
        event$?.emit({
            type: 'win:min',
            id: id,
        });
    };

    const close = () => {
        event$?.emit({
            type: 'win:close',
            id: id,
        });
    };

    return windowInfo ? (
        <div
            style={{
                left: position[0],
                top: position[1],
                zIndex: winLevel,
                maxWidth: boundingBox[2] - 2 || undefined,
                maxHeight: boundingBox[3] - 2 || undefined,
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
        <></>
    );
}
