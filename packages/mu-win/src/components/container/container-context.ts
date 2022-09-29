import React from 'react';
import { Event } from '@x-pro/cool-hook';
import { Container } from '../model/container';

export type BoxContextType = {
    boundingBox: [number, number, number, number];
    event?: Event<{
        type: string;
        ev?: React.MouseEvent;
        [key: string]: any;
    }>;
    container?: React.MutableRefObject<Container | undefined>;
};

export const ContainerContext = React.createContext<BoxContextType>({
    boundingBox: [0, 0, 0, 0],
});
