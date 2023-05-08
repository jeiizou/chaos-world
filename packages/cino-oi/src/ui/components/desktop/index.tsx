import React from 'react';
import { DesktopBackGround } from '../background/type';
import Background from '../background';
import ModeSwitcher from '../mode-switcher';

import windowSvg from '@/common/assets/imgs/window.svg';
import gridSvg from '@/common/assets/imgs/grid.svg';
import WindowLayout from '../window-layout';
import WindowBox from '../window-box';
import ContextMenu from '../contextmenu';
import IframeRender from '../app-render/iframe-render';

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
        {/* <WindowBox windowName="baidu">
          <IframeRender url="https://www.baidu.com"></IframeRender>
        </WindowBox>
        <WindowBox windowName="bilibili">
          <IframeRender url="https://www.bilibili.com"></IframeRender>
        </WindowBox> */}
      </WindowLayout>
      <ContextMenu></ContextMenu>
    </Background>
  );
}
