import React, { ReactElement } from 'react';
import styles from './box.module.scss';

type BoxProps = {
    children: ReactElement;
};  


export default function Box({children}: BoxProps): React.ReactElement {
    return <div className={styles.box}>{children}</div>;
}