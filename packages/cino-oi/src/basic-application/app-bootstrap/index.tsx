import { Cino } from '@/lib-entry';

export const AppBootstrapApp = Cino.createApp({
  id: 'app-bootstrap',
  name: '应用启动器',
  onInitialize: (app) => {
    console.log('应用初始化');
    // app.createDrawer(){

    // }
  },
  onActivate: (app) => {
    app.createView({
      title: '应用启动器',
      container: <div>启动APP</div>,
      renderType: 'react',
      size: {
        width: 200,
        height: 200,
      },
    });
  },
});
