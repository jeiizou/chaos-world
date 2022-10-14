import { useMount } from '@jeiiz/ohooks';
import React, { ReactNode } from 'react';
import { DesktopModel } from '../../model/desktop-model';
import { DesktopInstance } from '../../types';
import InnerDesktop from './inner';

type DesktopProps = {
    children?: ReactNode | ReactNode[];
    desktop: DesktopInstance;
};

export default function Desktop(props: DesktopProps): React.ReactElement {
    return (
        <DesktopModel.Provider>
            <InnerDesktop {...props} />
        </DesktopModel.Provider>
    );
}
