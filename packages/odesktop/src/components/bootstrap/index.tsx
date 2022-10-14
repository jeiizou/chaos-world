import React, { useState } from 'react';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import { styleMap } from '../../utils/just-js';
import AppItem from '../appItem';
import styles from './index.module.scss';

type AppInfoMap = Record<
    string,
    {
        name: string;
        icon?: string;
    }
>;

export default function Bootstrap(): React.ReactElement {
    const { subscribe$, containerDomain } = DesktopModel.useContext();

    const [visible, setVisible] = useState(false);
    const [appInfos, setAppInfos] = useState<AppInfoMap>({});

    subscribe$(EVENT_TYPE.APP_START, () => setVisible(true));

    subscribe$(EVENT_TYPE.APP_INSTALLED, () => {
        const apps = containerDomain.current?.getAppsSnapShot();
        if (!apps) return;
        const cAppInfos: AppInfoMap = {};
        for (const app of apps.values()) {
            cAppInfos[app.id] = app.info;
        }
        setAppInfos({ ...cAppInfos });
    });

    return (
        <div
            className={styleMap({
                [styles.bootstrap]: true,
                [styles['bootstrap--hide']]: !visible,
            })}
            onClick={() => setVisible(false)}>
            {Object.keys(appInfos).map(appId => (
                <AppItem id={appId} key={appId} {...appInfos[appId]} />
            ))}
        </div>
    );
}
