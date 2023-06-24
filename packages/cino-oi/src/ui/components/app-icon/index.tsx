import { CinoAppStatus, CinoApplication } from '@/lib-entry';
import React, { useMemo } from 'react';
import style from './index.module.scss';
import classNames from 'classnames';
import { EVENT_TYPE, WindowInfo, WindowModel } from '../window-layout/window-model';

type AppIconProps = {
  size?: 'small' | 'medium' | 'large';
  app: CinoApplication;
  showName?: boolean;
};

export default function AppIcon({
  app,
  size = 'medium',
  showName = false,
}: AppIconProps): React.ReactElement {
  const { emit$, windowMap } = WindowModel.useContext();
  const iconSrc = useMemo(() => {
    return app.getConfig()?.icon?.src;
  }, [app]);

  const windowList = useMemo(() => {
    const lWindowList: (WindowInfo & { winKey: string })[] = [];
    const keys = Object.keys(windowMap);
    keys.forEach((key) => {
      const widowInfo = windowMap[key];
      if (widowInfo?.viewInfo?.appId === app.getId()) {
        lWindowList.push({
          ...widowInfo,
          winKey: key,
        });
      }
    });
    return lWindowList;
  }, [windowMap, app]);

  /**
   * 至少一个窗口被最小化
   */
  const isHidden = useMemo(() => {
    return windowList.some((w) => !w.visible);
  }, [windowList]);

  const onIconClick = () => {
    if (app.status === CinoAppStatus.activate) {
      // app 已激活, 执行聚焦操作
      windowList.forEach((w) => {
        if (w?.viewInfo?.appId === app.getId()) {
          emit$(EVENT_TYPE.WIN_FOCUS, { id: w.winKey });
        }
      });
    } else {
      // 激活该APP
      app.activate();
    }
  };

  return (
    <div className={style.app_icon__container}>
      <div
        className={classNames(style.app_icon, `${style.app_icon}--${size}`, {
          [style['app_icon--hidden']]: isHidden,
        })}
        onClick={onIconClick}
      >
        <img src={iconSrc} alt={app.name} />
        <span className={style.app_icon__name}>{app.name}</span>
      </div>
      {showName && <div className={style['app_icon_show-name']}>{app.name}</div>}
    </div>
  );
}
