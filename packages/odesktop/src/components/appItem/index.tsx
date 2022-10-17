import React from 'react';
import AppSvg from '../../assets/app.svg';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import styles from './index.module.scss';

type AppItemProps = {
    // HOLD
    icon?: string;
    name: string;
    id: string;
};

export default function AppItem({
    icon,
    name,
    id,
}: AppItemProps): React.ReactElement {
    const { emit$ } = DesktopModel.useContext();

    const onOpenApp = () => emit$(EVENT_TYPE.APP_START, { id });

    return (
        <div className={styles['app-item']} onClick={onOpenApp}>
            <img
                className={styles['app-item-icon']}
                src={icon ?? AppSvg}
                alt='app-item-icon'
            />
            {name}
        </div>
    );
}
