import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

import BackgroundImageUrl from '@site/static/img/background.jpg';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.heroBanner}>Jeiiz's World</div>
      <img src={BackgroundImageUrl} alt="" />
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={`jeiiz's ${siteConfig.title}`}>
      <HomepageHeader></HomepageHeader>
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
