import React from 'react';
import { routes } from '../../route';
import styles from './index.module.less';
import { Link } from 'react-router-dom';

type IndexProps = {
  // HOLD
};

export default function Index({}: IndexProps): React.ReactElement {
  return (
    <div className={styles.App}>
      {routes.map((route) => {
        if (route.path === '/') {
          return null;
        } else {
          return (
            <div>
              <Link to={route.path}>{route.name}</Link>
            </div>
          );
        }
      })}
    </div>
  );
}
