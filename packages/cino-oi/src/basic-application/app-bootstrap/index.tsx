import { Cino } from '@/lib-entry';

export const AppBootstrapApp = Cino.createApp({
  id: 'app-bootstrap',
  name: '应用启动器',
  onActivate: (context) => {
    context.createInterFace({
      title: '应用启动器',
      size: {},
      container: <div>启动APP</div>,
    });
  },
});
