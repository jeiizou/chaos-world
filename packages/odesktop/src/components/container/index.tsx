import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useSize } from 'ahooks';
import { SizeType, sortDomWithSize } from '../../utils/helper';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';

type ContainerProps = {
    children: ReactNode | ReactNode[];
};

export default function ContainerComponent({
    children,
}: ContainerProps): React.ReactElement {
    const { emit$, setContainerSize } = DesktopModel.useContext();

    // container states manager
    const containerDom = useRef<HTMLDivElement>(null);
    const containerSize = useSize(containerDom);
    useEffect(() => {
        setContainerSize(containerSize);
    }, [containerSize]);

    const onMouseLeave = (ev: React.MouseEvent) => {
        emit$(EVENT_TYPE.CANVAS_LEAVE, {
            ev: ev,
        });
    };

    const onMouseMove = (ev: React.MouseEvent) => {
        emit$(EVENT_TYPE.CANVAS_MOVING, {
            ev: ev,
        });
    };

    const onClick = (ev: React.MouseEvent) => {
        if (ev.target === containerDom.current) {
            emit$(EVENT_TYPE.CANVAS_CLICK, {
                ev: ev,
            });
        }
    };

    return (
        <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseLeave}
            onClick={onClick}
            ref={containerDom}
            className={styles.box}>
            <>{children}</>
        </div>
    );
}
