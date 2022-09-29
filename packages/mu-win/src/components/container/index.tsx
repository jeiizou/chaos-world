import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useEvent, Event } from '@x-pro/cool-hook';
import { ContainerContext } from './container-context';
import { Container } from '../model/container';

type ContainerProps = {
    children: ReactNode | ReactNode[];
};

export default function ContainerLayout({
    children,
}: ContainerProps): React.ReactElement {
    // dom ref
    const containerDivRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<Container>();

    const event = useEvent<{
        type: string;
        ev?: React.MouseEvent;
        [key: string]: any;
    }>();

    event.useSubscription(val => {
        switch (val.type) {
            case 'win:focus':
                console.log('聚焦到窗口');
                break;
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

    const [boundingBox, setBoundingBox] = useState<
        [number, number, number, number]
    >([0, 0, 0, 0]);

    useEffect(() => {
        if (containerDivRef.current) {
            let container = new Container(containerDivRef.current);
            setBoundingBox(container.getBoundingBox());
            containerRef.current = container;
        }
    }, []);

    return (
        <ContainerContext.Provider
            value={{
                boundingBox: boundingBox,
                event,
                container: containerRef,
            }}>
            <div
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseLeave}
                ref={containerDivRef}
                className={styles.box}>
                {Array.isArray(children) ? <>{children}</> : children}
            </div>
        </ContainerContext.Provider>
    );
}
