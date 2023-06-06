import { CinoAppStatus, CinoApplication } from '@/lib-entry';
import React, { useMemo } from 'react';
import style from './index.module.scss';
import classNames from 'classnames';

type AppIconProps = {
  size?: 'small' | 'medium' | 'large';
  app: CinoApplication;
};

export default function AppIcon({ app, size = 'medium' }: AppIconProps): React.ReactElement {
  const iconSrc = useMemo(() => {
    return app.getConfig()?.icon?.src;
  }, [app]);

  const onIconClick = () => {
    if (app.status === CinoAppStatus.activate) {
      // TODO
      console.log('app 已经激活, 换别的操作');
    } else {
      app.activate();
    }
  };

  return (
    <div className={classNames(style.app_icon, `${style.app_icon}--${size}`)} onClick={onIconClick}>
      <img src={iconSrc} alt="" />
      <span className={style.app_icon__name}>{app.name}</span>
    </div>
  );
}
