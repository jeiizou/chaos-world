import { CinoEventsName, ViewInfo } from '@/core/cino.type';
import { CinoModel } from '@/ui/hooks/use-cino';
import React, { useEffect, useMemo, useState } from 'react';
import WindowBox from '../window-box';
import IframeRender from '../app-render/iframe-render';

type WindowViewsProps = {
  // HOLD
};

export default function WindowViews({}: WindowViewsProps): React.ReactElement {
  const { cino } = CinoModel.useContext();
  const [views, setViews] = useState<Record<string, ViewInfo>>({});

  useEffect(() => {
    if (cino) {
      // 获取当前已经注册的views
      const views = cino?.getViews();
      if (views) {
        setViews(views);
      }
      cino.events.on(CinoEventsName.RegisterView, ({ viewId, info }) => {
        console.log(viewId, info);
        setViews((oldViews) => {
          oldViews[viewId] = info;
          return {
            ...oldViews,
          };
        });
      });
    }
  }, [cino]);

  return (
    <React.Fragment>
      {Object.keys(views).map((viewKey) => {
        const viewInfo = views[viewKey];
        return (
          <WindowBox windowName={viewInfo.config.title} key={viewKey} windowId={viewKey} viewInfo={viewInfo}>
            {viewInfo.config.renderType === 'iframe' && viewInfo.config.url && (
              <IframeRender url={viewInfo.config.url}></IframeRender>
            )}
            {viewInfo.config.renderType === 'react' && viewInfo.config.container}
          </WindowBox>
        );
      })}
    </React.Fragment>
  );
}
