import React from 'react';
import { DesktopBackGround } from './type';

import styles from './index.module.scss';

type BackgroundProps = {
  background?: DesktopBackGround;
  children?: React.ReactNode;
};

export default function Background({ background, children }: BackgroundProps): React.ReactElement {
  return <div className={styles['desktop-background']}>{children}</div>;
}
