import React from 'react';
import { Event } from '@x-pro/cool-hook';
import { FreeLayout } from '../../model/free-layout';

export type BoxContextType = {
    boundingBox: number[];
    event?: Event<{
        type: string;
        ev?: React.MouseEvent;
        [key: string]: any;
    }>;
    container?: React.MutableRefObject<FreeLayout | undefined>;
    zlevelArr?: string[];
};

export const ContainerContext = React.createContext<BoxContextType>({
    boundingBox: [0, 0, 0, 0],
});
