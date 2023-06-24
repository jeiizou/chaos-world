import React, { useEffect, useMemo, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import styles from './style.module.scss';

import { useDebounce, useSize } from 'ahooks';

import closeSvg from '@/common/assets/imgs/close.svg';
import minusSvg from '@/common/assets/imgs/minus.svg';
import { EVENT_TYPE, WindowModel } from '../window-layout/window-model';
import { useMove } from '@/ui/hooks/basic/use-move';
import { ViewInfo } from '@/core/cino.type';

type WindowBoxProps = {
  children?: React.ReactNode;
  defaultPosition?: [number, number];
  windowId?: string;
  windowName?: string;
  viewInfo?: ViewInfo;
};

const paddingOffset = 10;

export default function WindowBox({
  children,
  defaultPosition = [paddingOffset, paddingOffset],
  windowId: id,
  windowName = 'app-name',
  viewInfo,
}: WindowBoxProps): React.ReactElement {
  const windowId = useMemo(() => {
    return id ?? nanoid();
  }, [id]);

  const { containerSize, subscribe$, emit$, zlevelArr, activeWindowId, windowMap } = WindowModel.useContext();

  const domHandle = useRef<HTMLDivElement>(null);
  const size = useSize(domHandle);
  const debouncedSize = useDebounce(size, { wait: 200 });
  const windowInfo = useMemo(() => windowMap?.[windowId], [windowId, windowMap]);

  // 移动相关逻辑
  const [isMoving, setIsMoving] = useState(false);
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

  // 层叠关系管理
  const winLevel = useMemo(() => {
    let index = zlevelArr?.indexOf(windowId);
    if (~index) {
      return zlevelArr?.length - index;
    }
    return undefined;
  }, [windowId, zlevelArr]);

  const focusCurrent = () => {
    emit$(EVENT_TYPE.WIN_FOCUS, { id: windowId });
  };

  useEffect(() => {
    if (emit$ && windowId && !windowMap[windowId]) {
      // 注册窗口
      emit$(EVENT_TYPE.APP_START, { id: windowId, name: windowName, viewInfo });
    }
  }, [windowId, emit$, windowName]);

  // 窗口尺寸管理
  useEffect(() => {
    if (debouncedSize) {
      emit$(EVENT_TYPE.WIN_RESIZE, {
        id: windowId,
        size: { ...debouncedSize },
      });
    }
  }, [debouncedSize]);

  // 按钮操作管理
  const max = () => {
    if (domHandle.current) {
      domHandle.current.style.width = `${containerSize?.width ?? 0 - paddingOffset * 2}px`;
      domHandle.current.style.height = `${containerSize?.height ?? 0 - paddingOffset * 2}px`;
      setPosition([paddingOffset, paddingOffset]);
    }
  };
  const min = () => emit$(EVENT_TYPE.WIN_MIN, { id: windowId });
  const close = () => emit$(EVENT_TYPE.WIN_CLOSE, { id: windowId });

  return (
    <div
      className={styles['window-box']}
      style={{
        left: position[0],
        top: position[1],
        maxWidth: (containerSize?.width ?? 0) - paddingOffset || undefined,
        maxHeight: (containerSize?.height ?? 0) - paddingOffset || undefined,
        userSelect: isMoving ? 'none' : undefined,
        zIndex: winLevel,
        display: windowInfo?.visible ? undefined : 'none',
        width: viewInfo?.config.size?.width,
        height: viewInfo?.config.size?.height,
      }}
      ref={domHandle}
      onMouseUp={endMoving}
      onMouseDown={focusCurrent}
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
          <div className={styles['window-box__header__ctrl__item']} onClick={min}>
            <img src={minusSvg} alt="ctrl_minus" />
          </div>
        </div>
        <div className={styles['window-box__header__title']} onMouseDown={(e) => e.stopPropagation()}>
          {windowName}
        </div>
      </div>
      {children}
    </div>
  );
}
