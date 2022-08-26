import React, { ReactNode } from 'react';
import styles from './win.module.scss';


type WinProps = {
    children: ReactNode;
    title: string;
};

export default function Win({children}: WinProps): React.ReactElement {
    return <div className={styles.win}>
        <div className={styles.winHeader}>
        </div>
        <div className={styles.winBody}>
            {children}
        </div>
    </div>;
}
