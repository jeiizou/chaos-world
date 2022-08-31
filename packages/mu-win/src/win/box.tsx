import React, {
    MouseEventHandler,
    ReactElement,
    useEffect,
    useRef,
    useState,
} from 'react';
import styles from './box.module.scss';
import { useEvent, Event } from '@x-pro/cool-hook';

type BoxProps = {
    children: ReactElement;
};

export type BoxContextType = {
    boundingBox: [number, number, number, number];
    event?: Event<{
        type: string;
        ev?: React.MouseEvent;
    }>;
};

export const BoxContext = React.createContext<BoxContextType>({
    boundingBox: [0, 0, 0, 0],
});

export default function Box({ children }: BoxProps): React.ReactElement {
    const domHandler = useRef<HTMLDivElement>(null);
    const event = useEvent<{
        type: string;
        ev?: React.MouseEvent;
    }>();

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
        setBoundingBox([
            0,
            0,
            domHandler.current?.clientWidth ?? 0,
            domHandler.current?.clientHeight ?? 0,
        ]);
    }, []);

    return (
        <BoxContext.Provider
            value={{
                boundingBox: boundingBox,
                event,
            }}>
            <div
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onMouseUp={onMouseLeave}
                ref={domHandler}
                className={styles.box}>
                {children}
            </div>
        </BoxContext.Provider>
    );
}
