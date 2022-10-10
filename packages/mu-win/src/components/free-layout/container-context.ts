import { EventEmitter } from 'ahooks/lib/useEventEmitter';
import React from 'react';
import type { WindowMapType } from '.';
import { FreeLayout } from '../../model/free-layout';

export type BoxContextType = {
    boundingBox: number[];
    event?: EventEmitter<{
        type: string;
        ev?: React.MouseEvent;
        [key: string]: any;
    }>;
    container?: React.MutableRefObject<FreeLayout | undefined>;
    zlevelArr?: string[];
    windowMap?: WindowMapType;
};

export const ContainerContext = React.createContext<BoxContextType>({
    boundingBox: [0, 0, 0, 0],
});
