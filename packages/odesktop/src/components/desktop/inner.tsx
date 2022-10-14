import { useMount } from '@jeiiz/ohooks';
import { useWhyDidYouUpdate } from 'ahooks';
import React, { ReactNode, useEffect } from 'react';
import { Application } from '../../domain/application';
import { Container as ContainerDomain } from '../../domain/container';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import { AppInstance, DesktopInstance } from '../../types';
import Bar from '../bar';
import Bootstrap from '../bootstrap';
import Container from '../container';
import ContextMenu from '../contextmenu';
import Dock from '../dock';
import styles from './index.module.scss';

type InnerDesktopProps = {
    children?: ReactNode | ReactNode[];
    desktop: DesktopInstance;
};

export default function InnerDesktop({
    desktop,
    children,
}: InnerDesktopProps): React.ReactElement {
    const { emit$, containerDomain } = DesktopModel.useContext();

    useMount(() => {
        containerDomain.current = ContainerDomain.getInstance();

        desktop.install = async (app: AppInstance) => {
            let application = new Application(app.id, {
                name: app.name,
                icon: app.icon,
            });
            let installFlag = await containerDomain?.current?.install(
                application,
            );
            if (installFlag) {
                emit$(EVENT_TYPE.APP_INSTALLED);
            }
        };
    });

    return (
        <>
            <div className={styles.desktop}>
                <Bar />
                <Container>
                    <>{children}</>
                </Container>
                <Dock />
            </div>
            <ContextMenu />
            <Bootstrap />
        </>
    );
}
