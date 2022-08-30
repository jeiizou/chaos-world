import React, { RefObject, useRef, useState } from 'react';
import { useThrottleFn } from '../functional/useThrottle';

type TargetDom = RefObject<HTMLElement>;

export interface UseMoveConfig {
    defaultPosition: [number, number];
}

export function useMove({ defaultPosition }: UseMoveConfig) {
    const [isMoving, setIsMoving] = useState(false);
    const [isStart, setIsStart] = useState(false);

    const positions = useRef([0, 0, 0, 0]);

    const [curPosition, setCurPosition] = useState(defaultPosition);

    const startMoving = (ev: React.MouseEvent) => {
        setIsMoving(true);
        if (!isStart) {
            positions.current[2] = ev.clientX;
            positions.current[3] = ev.clientY;
            setIsStart(true);
        }
    };

    const moving = (ev: React.MouseEvent) => {
        if (isMoving) {
            positions.current[0] = positions.current[2] - ev.clientX;
            positions.current[1] = positions.current[3] - ev.clientY;

            positions.current[2] = ev.clientX;
            positions.current[3] = ev.clientY;

            setCurPosition(p => {
                return [
                    p[0] - positions.current[0],
                    p[1] - positions.current[1],
                ];
            });
        }
    };

    const endMoving = () => {
        if (isMoving) {
            setIsMoving(false);
        }
    };

    return {
        startMoving,
        moving,
        endMoving,
        position: curPosition,
    };
}
