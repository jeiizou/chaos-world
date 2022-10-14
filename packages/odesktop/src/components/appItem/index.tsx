import React from 'react';
import AppSvg from '../../assets/app.svg';
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
    return (
        <div className={styles['app-item']}>
            <img
                className={styles['app-item-icon']}
                src={icon ?? AppSvg}
                alt=''
            />
            {name}
        </div>
    );
}
