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

    // // container action
    // const sortBoxers = () => {
    //     if (!containerSize) return;
    //     emit$(EVENT_TYPE.WIN_SORT, {
    //         position: sortDomWithSize(
    //             zlevelArr,
    //             windowMap,
    //             containerSize,
    //             DESKTOP_CONFIG.sortConfig,
    //         ),
    //     });
    // };

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

    return (
        <div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseLeave}
            ref={containerDom}
            className={styles.box}>
            <>{children}</>
        </div>
    );
}
