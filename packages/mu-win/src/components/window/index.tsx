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
import { useSize } from 'ahooks';

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
    const { boundingBox, event, zlevelArr = [] } = useContext(ContainerContext);
    // state
    const [isMoving, setIsMoving] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [id] = useState(`${title}:${nanoid(6)}`);
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

    // effects
    useEffect(() => {
        // set move position
        setBoundingBox([
            boundingBox[0] - (size?.width || 0),
            boundingBox[1] - (size?.height || 0),
            boundingBox[2],
            boundingBox[3],
        ]);
    }, [boundingBox]);

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

    useEffect(() => {
        setTimeout(() => {
            event?.emit({
                type: 'win:regis',
                id: id,
                title: title,
            });
        }, 0);
    }, []);

    const winLevel = useMemo(() => {
        let index = zlevelArr?.indexOf(id);
        if (~index) {
            return zlevelArr?.length - index;
        }
        return undefined;
    }, [zlevelArr, id]);

    useEffect(() => {
        if (size) {
            event?.emit({
                type: 'win:resize',
                id: id,
                size: { ...size },
            });
        }
    }, [size]);

    const max = () => {
        console.log('max');
    };

    const min = () => {
        console.log('min');
    };

    const close = () => {
        console.log('close');
    };

    return (
        <div
            style={{
                left: position[0],
                top: position[1],
                zIndex: winLevel,
                maxWidth: boundingBox[2] - 2 || undefined,
                maxHeight: boundingBox[3] - 2 || undefined,
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
    );
}
