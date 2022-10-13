import React, { ReactNode } from 'react';
import { DesktopModel } from '../../model/desktop-model';
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
                <>{children}</>
            </div>
        </DesktopModel.Provider>
    );
}
