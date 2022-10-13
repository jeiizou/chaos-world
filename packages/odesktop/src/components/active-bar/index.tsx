import React, { useContext } from 'react';
import { styleMap } from '../../utils/just-js';
import { ContainerContext } from '../free-layout/container-context';
import styles from './index.module.scss';

type ActiveBarProps = {
    // HOLD
};

export default function ActiveBar({}: ActiveBarProps): React.ReactElement {
    // context
    const {
        event$,
        windowMap = {},
        activeWindowId,
    } = useContext(ContainerContext);

    return (
        <div className={styles['free-layout__docker']}>
            {Object.keys(windowMap).map(key => {
                return (
                    <div
                        className={styleMap({
                            [styles['free-layout__docker__item']]: true,
                            [styles['free-layout__docker__item--active']]:
                                activeWindowId === key,
                            [styles['free-layout__docker__item--hidden']]:
                                !windowMap[key].visible,
                        })}
                        key={key}
                        onClick={() => {
                            event$?.emit({
                                type: 'win:focus',
                                id: key,
                            });
                        }}>
                        {windowMap[key].title}
                    </div>
                );
            })}
        </div>
    );
}
