import React, { ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useMove } from '../../hooks/useMove';
import { styleMap } from '../../utils/just-js';
import { useDebounce, useSize } from 'ahooks';

import addSvg from '../../assets/add.svg';
import closeSvg from '../../assets/close.svg';
import minusSvg from '../../assets/minus.svg';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';

type WinProps = {
  title?: string;
  defaultPosition?: [number, number];
  id: string;
};

export default function WindowComponent({
  defaultPosition = [0, 0],
  title,
  id,
}: WinProps): React.ReactElement {
  const { windowMap, containerSize, subscribe$, emit$, zlevelArr, activeWindowId } =
    DesktopModel.useContext();

  // dom ref
  const domHandle = useRef<HTMLDivElement>(null);
  const appContainerHandle = useRef<HTMLDivElement>(null);

  // state
  const [isMoving, setIsMoving] = useState(false);
  const size = useSize(domHandle);
  const debouncedSize = useDebounce(size, { wait: 200 });

  const windowInfo = useMemo(() => windowMap?.[id], [id, windowMap]);

  // hooks
  const { startMoving, moving, endMoving, position, setBoundingBox, setPosition } = useMove({
    defaultPosition: defaultPosition,
  });

  // effects
  useEffect(() => {
    if (containerSize && debouncedSize) {
      setBoundingBox([
        0,
        0,
        containerSize.width - debouncedSize.width,
        containerSize.height - debouncedSize.height,
      ]);
    }
  }, [containerSize, debouncedSize]);

  subscribe$(EVENT_TYPE.CANVAS_LEAVE, (val: any) => {
    setIsMoving(false);
    endMoving();
  });

  subscribe$(EVENT_TYPE.CANVAS_MOVING, (val: any) => {
    moving(val?.ev);
  });

  subscribe$(EVENT_TYPE.WIN_POSITION, (val: any) => {
    if (windowInfo && val?.positions) {
      const position = val.positions[id];
      position && setPosition(position);
    }
  });

  // function
  const focusCurrent = () => {
    emit$(EVENT_TYPE.WIN_FOCUS, { id });
  };

  const winLevel = useMemo(() => {
    let index = zlevelArr?.indexOf(id);
    if (~index) {
      return zlevelArr?.length - index;
    }
    return undefined;
  }, [zlevelArr, id]);

  useEffect(() => {
    if (debouncedSize) {
      emit$(EVENT_TYPE.WIN_RESIZE, {
        id: id,
        size: { ...debouncedSize },
      });
    }
  }, [debouncedSize]);

  const cpt = useRef<any>();
  useEffect(() => {
    if (appContainerHandle.current) {
      const app = windowInfo.app;
      let loadFn = app.load();
      let compony = loadFn(appContainerHandle.current);
      if (compony) {
        cpt.current = compony;
      }
    }
  }, []);

  const max = () => {
    if (domHandle.current) {
      domHandle.current.style.width = `${containerSize?.width ?? 0 - 2}px`;
      domHandle.current.style.height = `${containerSize?.height ?? 0 - 2}px`;
      setPosition([0, 0]);
    }
  };

  const min = () => emit$(EVENT_TYPE.WIN_MIN, { id });
  const close = () => emit$(EVENT_TYPE.WIN_CLOSE, { id });

  return windowInfo ? (
    <div
      style={{
        left: position[0],
        top: position[1],
        zIndex: winLevel,
        maxWidth: (containerSize?.width ?? 0) - 2 || undefined,
        maxHeight: (containerSize?.height ?? 0) - 2 || undefined,
        display: windowInfo?.visible ? undefined : 'none',
      }}
      className={styleMap({
        [styles.win]: true,
        [styles.moving]: isMoving,
        [styles.active]: activeWindowId === id,
      })}
      ref={domHandle}
      onMouseUp={endMoving}
      onMouseDown={focusCurrent}
    >
      <div
        onMouseDown={(e) => {
          setIsMoving(true);
          startMoving?.(e);
        }}
        className={styles.winHeader}
      >
        <span>{title}</span>
        <span className={styles.winIconGroup}>
          <span
            style={{
              backgroundColor: 'var(--success-light-color)',
            }}
            className={styles.winIconGroupItem}
            onClick={max}
          >
            <img src={addSvg} alt="" />
          </span>
          <span
            style={{
              backgroundColor: 'var(--warn-light-color)',
            }}
            className={styles.winIconGroupItem}
            onClick={min}
          >
            <img src={minusSvg} alt="" />
          </span>
          <span
            style={{ backgroundColor: 'var(--error-light-color)' }}
            className={styles.winIconGroupItem}
            onClick={close}
          >
            <img src={closeSvg} alt="" />
          </span>
        </span>
      </div>
      <div className={styles.winBody}>
        <div ref={appContainerHandle}>{cpt.current}</div>
      </div>
    </div>
  ) : (
    <></>
  );
}
