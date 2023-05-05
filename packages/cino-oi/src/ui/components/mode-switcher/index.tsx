import React, { useState } from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

type ModeSwitcherProps = {
  modes: {
    icon?: string;
    key: string;
    name: string;
  }[];
};

export default function ModeSwitcher({ modes }: ModeSwitcherProps): React.ReactElement {
  const [modeValue, setModeValue] = useState(modes?.[0]?.key ?? '');

  return (
    <div className={styles['mode-switcher']}>
      {modes.map((mode) => (
        <div
          key={mode.key}
          className={classnames(styles['mode-switcher__item'], {
            [styles['mode-switcher__item--active']]: mode.key === modeValue,
          })}
          onClick={() => {
            setModeValue(mode.key);
          }}
        >
          <img src={mode.icon} alt={mode.name} />
        </div>
      ))}
    </div>
  );
}
