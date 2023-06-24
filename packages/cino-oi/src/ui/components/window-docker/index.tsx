import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { EVENT_TYPE, WindowModel } from '../window-layout/window-model';
import { CinoModel } from '@/ui/hooks/use-cino';
import classnames from 'classnames';

import AppSvg from '@/common/assets/imgs/app.svg';
import { CinoEventsName } from '@/core/cino.type';
import { CinoApplication } from '@/lib-entry';
import AppIcon from '../app-icon';

type WindowDockerProps = {
  position?: string;
  children?: React.ReactNode;
};

export default function WindowDocker({ position, children }: WindowDockerProps): React.ReactElement {
  const { windowMap, emit$ } = WindowModel.useContext();
  const { cino } = CinoModel.useContext();

  const [dockerApps, setDockerApps] = useState<Record<string, CinoApplication>>({});

  const getDockerBootApps = () => {
    if (!cino) {
      return;
    }
    const apps: Record<string, CinoApplication> = {};
    cino.getApps().forEach((app) => {
      const config = app.getConfig();
      config?.boot?.forEach((bootConfig) => {
        if (bootConfig.type === 'docker') {
          apps[app.getId()] = app;
        }
      });
    });
    setDockerApps(apps);
  };

  useEffect(() => {
    if (cino) {
      // 监听app的安装事件
      cino.events.on(CinoEventsName.AppInstall, ({ id, app }) => {
        if (!dockerApps[id]) {
          setDockerApps((oldMapValue) => {
            oldMapValue[id] = app;
            return {
              ...oldMapValue,
            };
          });
        }
      });

      // 获取所有注册到docker的app
      getDockerBootApps();
    }
  }, [cino]);

  return (
    <div className={styles['window-docker']}>
      <div className={styles['window-docker__stable-container']}>
        {Object.values(dockerApps)?.map((app) => {
          return <AppIcon app={app} key={app.getId()}></AppIcon>;
        })}
        {children}
      </div>
      {/* 当前窗口管理 */}
      {Object.keys(windowMap)
        .filter((winKey) => !dockerApps[windowMap[winKey].viewInfo?.appId ?? ''])
        .map((windowKey) => (
          <div
            key={windowKey}
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
