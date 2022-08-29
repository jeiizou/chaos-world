import React, { RefObject, useState } from 'react';
import { useThrottleFn } from '../functional/useThrottle';

type TargetDom = RefObject<HTMLElement>;

export interface UseMoveConfig {
    defaultPosition: [number, number];
}

export function useMove({ defaultPosition }: UseMoveConfig) {
    const [isMoving, setIsMoving] = useState(false);
    const [isStart, setIsStart] = useState(false);

    const [startPosition, setStartPosition] = useState([0, 0]);

    const [moveStartPosition, setMoveStartPosition] = useState(defaultPosition);
    const [currentPosition, setCurrentPosition] = useState(defaultPosition);

    const startMoving = (ev: React.MouseEvent) => {
        setIsMoving(true);
        if (!isStart) {
            console.log('start moving');
            setStartPosition([ev.clientX, ev.clientY]);
            setIsStart(true);
        }
    };

    const moving = (ev: React.MouseEvent) => {
        if (isMoving) {
            let offsetX = ev.clientX - startPosition[0];
            let offsetY = ev.clientY - startPosition[1];

            console.log('moving', moveStartPosition, offsetX, offsetY);

            setCurrentPosition([
                moveStartPosition[0] + offsetX,
                moveStartPosition[1] + offsetY,
            ]);
        }
    };

    const endMoving = () => {
        if (isMoving) {
            setMoveStartPosition(currentPosition);
            setIsMoving(false);
        }
    };

    return {
        startMoving,
        moving,
        endMoving,
        position: currentPosition,
    };
}
