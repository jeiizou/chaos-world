import { AppInstance, AppType } from '../../types';
import AppStore from './components';

function install(): AppInstance {
  return {
    component: <AppStore />,
    id: 'app-store-panel',
    name: '应用商店',
    type: AppType.ReactComponentApp,
  };
}

export default {
  install,
};
