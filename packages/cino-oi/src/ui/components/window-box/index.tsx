import React, { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

import { useDebounce, useSize } from 'ahooks';

import closeSvg from '@/common/assets/imgs/close.svg';
import minusSvg from '@/common/assets/imgs/minus.svg';
import { EVENT_TYPE, WindowModel } from '../window-layout/window-model';
import { useMove } from '@/ui/hooks/basic/use-move';

type WindowBoxProps = {
  children: React.ReactNode;
  defaultPosition?: [number, number];
};

const paddingOffset = 10;

export default function WindowBox({
  children,
  defaultPosition = [paddingOffset, paddingOffset],
}: WindowBoxProps): React.ReactElement {
  const { containerSize, subscribe$, emit$, zlevelArr, activeWindowId } = WindowModel.useContext();

  const [isMoving, setIsMoving] = useState(false);
  const domHandle = useRef<HTMLDivElement>(null);
  const size = useSize(domHandle);
  const debouncedSize = useDebounce(size, { wait: 200 });

  const { startMoving, moving, endMoving, position, setBoundingBox, setPosition } = useMove({
    defaultPosition: defaultPosition,
  });

  useEffect(() => {
    if (containerSize && debouncedSize) {
      setBoundingBox([
        10,
        10,
        containerSize?.width - debouncedSize.width - paddingOffset,
        containerSize?.height - debouncedSize.height - paddingOffset,
      ]);
    }
  }, [containerSize, debouncedSize]);

  subscribe$(EVENT_TYPE.CANVAS_MOVING, (val: any) => {
    moving(val?.ev);
  });

  subscribe$(EVENT_TYPE.CANVAS_LEAVE, (val: any) => {
    setIsMoving(false);
    endMoving();
  });

  return (
    <div
      className={styles['window-box']}
      style={{
        left: position[0],
        top: position[1],
        maxWidth: (containerSize?.width ?? 0) - paddingOffset || undefined,
        maxHeight: (containerSize?.height ?? 0) - paddingOffset || undefined,
        userSelect: isMoving ? 'none' : undefined,
      }}
      ref={domHandle}
      onMouseUp={endMoving}
    >
      <div
        className={styles['window-box__header']}
        onMouseDown={(e) => {
          setIsMoving(true);
          startMoving?.(e);
        }}
      >
        <div className={styles['window-box__header__ctrl']} onMouseDown={(e) => e.stopPropagation()}>
          <div className={styles['window-box__header__ctrl__item']}>
            <img src={closeSvg} alt="ctrl_close" />
          </div>
          <div className={styles['window-box__header__ctrl__item']}>
            <img src={minusSvg} alt="ctrl_minus" />
          </div>
        </div>
        <div className={styles['window-box__header__title']} onMouseDown={(e) => e.stopPropagation()}>
          app-name
        </div>
      </div>
      {children}
    </div>
  );
}
