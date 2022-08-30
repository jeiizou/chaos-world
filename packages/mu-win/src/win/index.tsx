import React, { ReactNode, useEffect, useRef } from 'react';
import styles from './win.module.scss';
import { useMove } from '@x-pro/cool-hook';

type WinProps = {
    children: ReactNode;
    title: string;
};

export default function Win({ children }: WinProps): React.ReactElement {
    const domHandle = useRef<HTMLDivElement>(null);
    const { startMoving, moving, endMoving, position } = useMove({
        defaultPosition: [0, 0],
    });
    return (
        <div
            style={{ left: position[0], top: position[1] }}
            className={styles.win}
            ref={domHandle}
            // onMouseLeave={endMoving}
            onMouseUp={endMoving}
            onMouseMove={moving}>
            <div onMouseDown={startMoving} className={styles.winHeader}></div>
            <div className={styles.winBody}>{children}</div>
        </div>
    );
}
