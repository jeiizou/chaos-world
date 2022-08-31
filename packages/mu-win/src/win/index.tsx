import React, { ReactNode, useContext, useEffect, useRef } from 'react';
import styles from './win.module.scss';
import { useMove } from '@x-pro/cool-hook';
import { BoxContext } from './box';

type WinProps = {
    children: ReactNode;
    title: string;
};

export default function Win({ children }: WinProps): React.ReactElement {
    const { boundingBox, event } = useContext(BoxContext);
    const domHandle = useRef<HTMLDivElement>(null);
    const { startMoving, moving, endMoving, position, setBoundingBox } =
        useMove({
            defaultPosition: [0, 0],
        });

    useEffect(() => {
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
                endMoving();
                break;
            case 'moving':
                moving(val.ev);
                break;
            default:
                break;
        }
    });

    return (
        <div
            style={{ left: position[0], top: position[1] }}
            className={styles.win}
            ref={domHandle}
            // onMouseLeave={endMoving}
            onMouseUp={endMoving}
            // onMouseMove={moving}
        >
            <div onMouseDown={startMoving} className={styles.winHeader}></div>
            <div className={styles.winBody}>{children}</div>
        </div>
    );
}
