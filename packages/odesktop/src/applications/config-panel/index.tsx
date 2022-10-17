import { AppInstance, AppType } from '../../types';
import ConfigPanel from './components';

function install(): AppInstance {
    return {
        component: <ConfigPanel />,
        id: 'config-panel',
        name: '设置',
        type: AppType.ReactComponentApp,
    };
}

export default {
    install,
};
