import React, { useContext } from 'react';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import { styleMap } from '../../utils/just-js';
import styles from './index.module.scss';

import appSVG from '../../assets/app.svg';

type ActiveBarProps = {
    // HOLD
};

export default function ActiveBar({}: ActiveBarProps): React.ReactElement {
    const { windowMap, emit$, activeWindowId } = DesktopModel.useContext();

    return Object.keys(windowMap).length > 0 ? (
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
                        <img
                            src={appSVG}
                            alt=''
                            style={{
                                width: 18,
                                height: 18,
                            }}
                        />
                        <div className={styles.item_title}>
                            {windowMap[key].app.info.name}
                        </div>
                    </div>
                );
            })}
        </div>
    ) : (
        <></>
    );
}
