import React, { ReactNode } from 'react';
import { DesktopModel } from '../../model/desktop-model';
import Bar from '../bar';
import Container from '../container';
import ContextMenu from '../contextmenu';
import Dock from '../dock';
import styles from './index.module.scss';

type DesktopProps = {
    children: ReactNode | ReactNode[];
};

export default function Desktop({
    children,
}: DesktopProps): React.ReactElement {
    return (
        <DesktopModel.Provider>
            <div className={styles.desktop}>
                <Bar />
                <Container>
                    <>{children}</>
                </Container>
                <Dock />
                <ContextMenu />
            </div>
        </DesktopModel.Provider>
    );
}
