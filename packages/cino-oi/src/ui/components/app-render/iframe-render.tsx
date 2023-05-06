import React from 'react';

type IframeRenderProps = {
  url: string;
};

export default function IframeRender({ url }: IframeRenderProps): React.ReactElement {
  return (
    <iframe
      style={{
        width: '100%',
        height: 'calc(100% - 35px)',
        padding: 0,
        border: 0,
      }}
      src={url}
    ></iframe>
  );
}
