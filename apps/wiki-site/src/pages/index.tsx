import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

import useGlobalData from '@docusaurus/useGlobalData';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.heroBanner}>Xkan asux</div>
      {/* <img src={BackgroundImageUrl} alt="" /> */}
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const globalData = useGlobalData();

  const contentData = globalData['docusaurus-plugin-content-docs']['default'] as any;
  const docs = contentData.versions?.[0].docs;

  return (
    <Layout title={`jeiiz's ${siteConfig.title}`}>
      <HomepageHeader></HomepageHeader>
      <main>
        <div className="flex flex-wrap">
          {docs?.map((item) => (
            <div className="p-2">{item.id}</div>
          ))}
        </div>

        <HomepageFeatures />
      </main>
    </Layout>
  );
}
