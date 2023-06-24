import { Cino } from '@/lib-entry';
import SysSetting from './ui/App';
import SettingIconSvg from '@/common/assets/imgs/setting.svg';

export const SysSettingApp = Cino.createApp({
  id: 'sys-setting',
  name: '系统设置',

  config: {
    icon: {
      src: SettingIconSvg,
    },
    boot: [
      {
        type: 'docker',
        persistence: true,
      },
    ],
  },

  onActivate: (app) => {
    app.createView({
      title: '系统设置',
      container: <SysSetting />,
      renderType: 'react',
      size: {
        width: 800,
        height: 400,
      },
    });
  },
});
