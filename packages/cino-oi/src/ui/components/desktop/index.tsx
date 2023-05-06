import React from 'react';
import { DesktopBackGround } from '../background/type';
import Background from '../background';
import ModeSwitcher from '../mode-switcher';

import windowSvg from '@/common/assets/imgs/window.svg';
import gridSvg from '@/common/assets/imgs/grid.svg';
import WindowLayout from '../window-layout';
import WindowBox from '../window-box';
import ContextMenu from '../contextmenu';

type DesktopProps = {
  /**
   * 背景设置
   */
  background?: DesktopBackGround;
};

export default function Desktop({ background }: DesktopProps): React.ReactElement {
  return (
    <Background background={background}>
      <ModeSwitcher
        modes={[
          {
            icon: windowSvg,
            key: 'window',
            name: '窗口',
          },
          {
            icon: gridSvg,
            key: 'grid',
            name: '网格',
          },
        ]}
      ></ModeSwitcher>
      <WindowLayout>
        <WindowBox windowName="window1">window1</WindowBox>
        <WindowBox windowName="window2">window2</WindowBox>
      </WindowLayout>
      <ContextMenu></ContextMenu>
    </Background>
  );
}
