import React, { useEffect, useState } from 'react';
import styles from './app.module.scss';

import lineBasic from './components/line';
import ellipseBasic from './components/ellipse';
import polygonBasic from './components/polygon';

const Demos = [
  {
    label: '基础',
    value: 'basic',
    initFunc: lineBasic
  },
  {
    label: '椭圆',
    value: 'ellipse',
    initFunc: ellipseBasic
  },
  {
    label: '几何',
    value: 'polygon',
    initFunc: polygonBasic
  }
];

function App() {
  const [curDemoValue, setCurDemoValue] = useState(Demos[0].value);

  useEffect(() => {
    if (curDemoValue) {
      const curDemoItem = Demos.find((item) => item.value === curDemoValue);
      if (curDemoItem) {
        setTimeout(() => {
          curDemoItem.initFunc('#canvas-map');
        }, 10);
      }
    }
  }, [curDemoValue]);

  return (
    <div className={styles['sandbox-container']}>
      <div className={styles['sandbox-demos']}>
        <div className={styles['sandbox-demo-title']}>示例</div>
        {Demos.map((demo) => (
          <div
            className={`${styles['sandbox-demo-item']}  ${curDemoValue === demo.value ? styles.active : ''}`}
            key={demo.value}
            onClick={() => {
              setCurDemoValue(demo.value);
            }}
          >
            {demo.label}
          </div>
        ))}
      </div>
      <div className={styles['sandbox-scene']}>
        {curDemoValue && (
          <canvas
            style={{
              width: '100%',
              height: '100%'
            }}
            id="canvas-map"
          ></canvas>
        )}
      </div>
    </div>
  );
}

export default App;
