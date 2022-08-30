import React, { RefObject, useRef, useState } from 'react';
import { useSmoothFn } from '../functional/useSmoothFn';
import { useThrottleFn } from '../functional/useThrottleFn';

type TargetDom = RefObject<HTMLElement>;

export interface UseMoveConfig {
    defaultPosition: [number, number];
}

/**
 * 拖拽dom移动
 * 1. 拖动太快的时候会丢失
 * 2. 拖动边界
 * @param param0
 * @returns
 */
export function useMove({ defaultPosition }: UseMoveConfig) {
    const [isMoving, setIsMoving] = useState(false);

    const positions = useRef([0, 0, 0, 0]);

    const [curPosition, setCurPosition] = useState(defaultPosition);

    const startMoving = (ev: React.MouseEvent) => {
        setIsMoving(true);
        positions.current[2] = ev.clientX;
        positions.current[3] = ev.clientY;
    };

    const { run: moving } = useSmoothFn((ev: React.MouseEvent) => {
        if (isMoving) {
            positions.current[0] = positions.current[2] - ev.clientX;
            positions.current[1] = positions.current[3] - ev.clientY;

            positions.current[2] = ev.clientX;
            positions.current[3] = ev.clientY;

            setCurPosition(p => {
                const newPosition = [
                    p[0] - positions.current[0],
                    p[1] - positions.current[1],
                ] as [number, number];
                return newPosition;
            });
        }
    });

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
