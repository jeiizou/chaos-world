import { Cino } from '@/lib-entry';
import AppIconSvg from '@/common/assets/imgs/app.svg';

export const AppBootstrapApp = Cino.createApp({
  id: 'app-bootstrap',
  name: '应用启动器',

  config: {
    icon: {
      src: AppIconSvg,
    },
    boot: [
      {
        type: 'docker',
        persistence: true,
      },
    ],
  },

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
