import React, { useState } from 'react';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import { styleMap } from '../../utils/just-js';
import styles from './index.module.scss';

type BootstrapProps = {
    // HOLD
};

export default function Bootstrap({}: BootstrapProps): React.ReactElement {
    const { subscribe$ } = DesktopModel.useContext();

    const [visible, setVisible] = useState(false);

    subscribe$(EVENT_TYPE.APP_START, () => {
        setVisible(true);
    });

    return (
        <div
            className={styleMap({
                [styles.bootstrap]: true,
                [styles['bootstrap--hide']]: !visible,
            })}
            onClick={() => {
                setVisible(false);
            }}>
            apps
        </div>
    );
}
