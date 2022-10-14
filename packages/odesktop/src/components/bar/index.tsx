import React from 'react';
import LayoutSvg from '../../assets/layout.svg';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import styles from './index.module.scss';

type BarProps = {
    // HOLD
};

export default function Bar({}: BarProps): React.ReactElement {
    const { emit$, DESKTOP_CONFIG } = DesktopModel.useContext();

    return (
        <div className={styles.bar}>
            <div
                className={styles.btn}
                onClick={() => {
                    emit$(EVENT_TYPE.BAR_SORT);
                }}>
                <img src={LayoutSvg} alt='' />
            </div>
        </div>
    );
}
