import useGlobalData from '@docusaurus/useGlobalData';
import React from 'react';

export default function DocsTree() {
  const globalData = useGlobalData();

  const contentData = globalData['docusaurus-plugin-content-docs']['default'] as any;
  const docs = contentData.versions?.[0].docs;

  return (
    <span
      style={{
        borderRadius: '2px',
        padding: '0.2rem',
      }}
    >
      <div className="flex flex-wrap">
        {docs?.map((item) => (
          <div className="p-2">{item.id}</div>
        ))}
      </div>
    </span>
  );
}
