import React, { useContext } from 'react';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import { styleMap } from '../../utils/just-js';
import styles from './index.module.scss';

type ActiveBarProps = {
    // HOLD
};

export default function ActiveBar({}: ActiveBarProps): React.ReactElement {
    const {
        windowMap,
        containerSize,
        subscribe$,
        emit$,
        zlevelArr,
        activeWindowId,
    } = DesktopModel.useContext();

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
                            emit$(EVENT_TYPE.WIN_FOCUS, {
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
