import React, { useEffect, useRef } from 'react';
import styles from './styles.module.scss';
import { EVENT_TYPE, WindowModel } from './window-model';
import { useSize } from 'ahooks';
import WindowDocker from '../window-docker';

export type WindowLayoutInnerProps = {
  children: React.ReactNode;
};

export default function WindowLayoutInner({ children }: WindowLayoutInnerProps): React.ReactElement {
  const { setContainerSize, emit$ } = WindowModel.useContext();

  const containerDom = useRef<HTMLDivElement>(null);
  const layoutSize = useSize(containerDom);
  useEffect(() => {
    if (layoutSize) {
      setContainerSize(layoutSize);
    }
  }, [layoutSize]);

  const onMouseLeave = (ev: React.MouseEvent) => {
    emit$(EVENT_TYPE.CANVAS_LEAVE, {
      ev: ev,
    });
  };

  const onMouseMove = (ev: React.MouseEvent) => {
    emit$(EVENT_TYPE.CANVAS_MOVING, {
      ev: ev,
    });
  };

  const onClick = (ev: React.MouseEvent) => {
    if (ev.target === containerDom.current) {
      emit$(EVENT_TYPE.CANVAS_CLICK, {
        ev: ev,
      });
    }
  };

  return (
    <>
      <div
        className={styles['window-layout']}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseLeave}
        onClick={onClick}
        ref={containerDom}
      >
        {children}
      </div>
    </>
  );
}
