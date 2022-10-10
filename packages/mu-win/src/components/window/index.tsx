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
        event,
        zlevelArr = [],
        windowMap,
    } = useContext(ContainerContext);
    // state
    const [isMoving, setIsMoving] = useState(false);
    const [isActive, setIsActive] = useState(false);

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

    event?.useSubscription(val => {
        switch (val.type) {
            case 'leave':
                setIsMoving(false);
                endMoving();
                break;
            case 'moving':
                moving(val.ev);
                break;
            case 'win:focus':
                const isActive = val.id === id;
                setIsActive(isActive);
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
        event?.emit({
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
            event?.emit({
                type: 'win:regis',
                id: id,
                title: title,
            });
        }, 0);
    }, []);

    useEffect(() => {
        if (debouncedSize) {
            event?.emit({
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
        event?.emit({
            type: 'win:min',
            id: id,
        });
    };

    const close = () => {
        event?.emit({
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
                [styles.active]: isActive,
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
                    <span className={styles.winIconGroupItem} onClick={max}>
                        +
                    </span>
                    <span className={styles.winIconGroupItem} onClick={min}>
                        -
                    </span>
                    <span className={styles.winIconGroupItem} onClick={close}>
                        x
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
