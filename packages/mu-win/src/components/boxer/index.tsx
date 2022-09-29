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
import { ContainerContext } from '../container/container-context';
import { Boxer } from '../model/boxer';
import { useMount } from 'ahooks';
import { styleMap } from '../../utils/just-js';

type WinProps = {
    children: ReactNode | ReactNode[];
    title?: string;
    defaultPosition?: [number, number];
};

export default function BoxerCpt({
    children,
    defaultPosition = [0, 0],
    title,
}: WinProps): React.ReactElement {
    // dom ref
    const domHandle = useRef<HTMLDivElement>(null);

    const boxerRef = useRef<Boxer>();

    const { boundingBox, event, container } = useContext(ContainerContext);

    const [isMoving, setIsMoving] = useState(false);
    const [level, setLevel] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [size, setSize] = useState([0, 0]);

    const { startMoving, moving, endMoving, position, setBoundingBox } =
        useMove({
            defaultPosition: defaultPosition,
        });

    useEffect(() => {
        // set move position
        setBoundingBox([
            boundingBox[0],
            boundingBox[1],
            boundingBox[2] - (domHandle.current?.clientWidth ?? 0),
            boundingBox[3] - (domHandle.current?.clientHeight ?? 0),
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
            case 'focus':
                let level = boxerRef.current?.level ?? 0;
                setLevel(level);
                const isActive = val.activeId === boxerRef.current?.id;
                setIsActive(isActive);
            default:
                break;
        }
    });

    useMount(() => {
        if (domHandle.current && container?.current) {
            let boxer = new Boxer(domHandle.current);
            boxer.register(container?.current);
            setSize([boxer.width, boxer.height]);
            boxerRef.current = boxer;
        }
    });

    return (
        <div
            style={{
                left: position[0],
                top: position[1],
                zIndex: level,
                width: size[0] || undefined,
                height: size[1] || undefined,
                maxHeight: boundingBox[2],
                maxWidth: boundingBox[3],
            }}
            className={styleMap({
                [styles.win]: true,
                [styles.moving]: isMoving,
                [styles.active]: isActive,
            })}
            ref={domHandle}
            onMouseUp={endMoving}
            onMouseDown={() => {
                boxerRef.current?.focus();
                event?.emit({
                    type: 'focus',
                    activeId: boxerRef.current?.id,
                });
            }}>
            <div
                onMouseDown={e => {
                    setIsMoving(true);
                    startMoving?.(e);
                }}
                className={styles.winHeader}>
                {title}
            </div>
            <div className={styles.winBody}>
                {Array.isArray(children) ? <>{children}</> : children}
            </div>
        </div>
    );
}
