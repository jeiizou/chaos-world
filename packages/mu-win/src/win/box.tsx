import React, { ReactElement, useRef } from 'react';
import styles from './box.module.scss';
import { useMove } from '@x-pro/cool-hook';

type BoxProps = {
    children: ReactElement;
};

export type BoxContextType = {
    boundingBox: [number, number, number, number];
};

const BoxContext = React.createContext({
    boundingBox: [0, 0, 0, 0],
});

export default function Box({ children }: BoxProps): React.ReactElement {
    const domHanlder = useRef<HTMLDivElement>(null);

    return (
        <BoxContext.Provider
            value={{
                boundingBox: [
                    0,
                    0,
                    domHanlder.current?.clientWidth ?? 0,
                    domHanlder.current?.clientHeight ?? 0,
                ],
            }}>
            <div ref={domHanlder} className={styles.box}>
                {children}
            </div>
            ;
        </BoxContext.Provider>
    );
}
