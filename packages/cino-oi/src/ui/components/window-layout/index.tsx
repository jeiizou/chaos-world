import React from 'react';
import { WindowModel } from './window-model';
import WindowLayoutInner, { WindowLayoutInnerProps } from './inner';

export default function WindowLayout(props: WindowLayoutInnerProps): React.ReactElement {
  return (
    <WindowModel.Provider>
      <WindowLayoutInner {...props} />
    </WindowModel.Provider>
  );
}
