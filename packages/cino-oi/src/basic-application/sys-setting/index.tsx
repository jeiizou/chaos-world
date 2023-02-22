import { Cino } from '@/lib-entry';
import SysSetting from './ui/App';

export const SysSettingApp = Cino.createApp({
  name: 'sys-setting',
  onActivate: (context) => {
    context.createInterFace({
      title: '系统设置',
      size: {},
      container: <SysSetting />,
    });
  },
});
