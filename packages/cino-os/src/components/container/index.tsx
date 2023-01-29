import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useSize } from 'ahooks';
import { SizeType, sortDomWithSize } from '../../utils/helper';
import { DesktopModel, EVENT_TYPE } from '../../model/desktop-model';
import WindowComponent from '../window';

type ContainerProps = {
  // HOLD
};

export default function ContainerComponent({}: ContainerProps): React.ReactElement {
  const { emit$, setContainerSize, windowMap } = DesktopModel.useContext();

  // container states manager
  const containerDom = useRef<HTMLDivElement>(null);
  const containerSize = useSize(containerDom);
  useEffect(() => {
    setContainerSize(containerSize);
  }, [containerSize]);

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
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseLeave}
      onClick={onClick}
      ref={containerDom}
      className={styles.box}
    >
      {Object.keys(windowMap).map((winKey) => (
        <WindowComponent id={winKey} title={windowMap[winKey].app.info.name} key={winKey}></WindowComponent>
      ))}
    </div>
  );
}
