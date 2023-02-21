import React, { RefObject, useRef, useState } from 'react';
import { useSmoothFn } from './useSmoothFn';

type TargetDom = RefObject<HTMLElement>;

export interface UseMoveConfig {
  defaultPosition: [number, number];
}

/**
 * 拖拽dom移动
 * @param param0
 * @returns
 */
export function useMove({ defaultPosition }: UseMoveConfig) {
  const [isMoving, setIsMoving] = useState(false);
  const [boundingBox, setBoundingBox] = useState<[number, number, number, number]>([0, 0, 0, 0]);

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

      setCurPosition((p) => {
        let xOffset = p[0] - positions.current[0];
        xOffset = Math.max(boundingBox[0], xOffset);
        xOffset = Math.min(boundingBox[2], xOffset);

        let yOffset = p[1] - positions.current[1];
        yOffset = Math.max(boundingBox[1], yOffset);
        yOffset = Math.min(boundingBox[3], yOffset);

        return [xOffset, yOffset] as [number, number];
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
    setBoundingBox,
    position: curPosition,
    setPosition: setCurPosition,
  };
}
