import { CinoAppStatus, CinoApplication } from '@/lib-entry';
import React, { useMemo } from 'react';
import style from './index.module.scss';
import classNames from 'classnames';
import { EVENT_TYPE, WindowModel } from '../window-layout/window-model';

type AppIconProps = {
  size?: 'small' | 'medium' | 'large';
  app: CinoApplication;
};

export default function AppIcon({ app, size = 'medium' }: AppIconProps): React.ReactElement {
  const { emit$ } = WindowModel.useContext();
  const iconSrc = useMemo(() => {
    return app.getConfig()?.icon?.src;
  }, [app]);

  const onIconClick = () => {
    if (app.status === CinoAppStatus.activate) {
      // app 已激活, 执行聚焦操作
      emit$(EVENT_TYPE.WIN_FOCUS, { id: app.getId() });
    } else {
      // 激活该APP
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
