import React from 'react';
import styles from './styles.module.scss';
import { EVENT_TYPE, WindowModel } from '../window-layout/window-model';
import classnames from 'classnames';

import AppSvg from '@/common/assets/imgs/app.svg';

type WindowDockerProps = {
  position?: string;
};

export default function WindowDocker({ position }: WindowDockerProps): React.ReactElement {
  const { windowMap, emit$ } = WindowModel.useContext();

  return (
    <div className={styles['window-docker']}>
      {Object.keys(windowMap).map((windowKey) => (
        <div
          className={classnames(styles['window-docker__item'], {
            [styles['window-docker__item--hidden']]: !windowMap[windowKey].visible,
          })}
          title={windowMap[windowKey].name}
          onClick={() => {
            emit$(EVENT_TYPE.WIN_FOCUS, { id: windowKey });
          }}
        >
          <img src={AppSvg} alt={windowMap[windowKey].name} />
        </div>
      ))}
    </div>
  );
}
