import { CinoModel } from '@/ui/hooks/use-cino';
import React from 'react';
import styles from './styles.module.scss';
import AppIconSvg from '@/common/assets/imgs/app.svg';

type AppDrawerProps = {
  // HOLD
};

export default function WindowDrawer({}: AppDrawerProps): React.ReactElement {
  // const { cino } = CinoModel.useContext();

  return (
    <div className={styles['window-docker__item']}>
      <img src={AppIconSvg} alt="" />
    </div>
  );
}
