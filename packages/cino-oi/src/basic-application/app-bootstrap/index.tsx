import { Cino } from '@/lib-entry';
import AppIconSvg from '@/common/assets/imgs/app.svg';
import { CinoEventsName } from '@/core/cino.type';
import AppIcon from '@/ui/components/app-icon';
import AppBoot from './ui/App';

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

  appMap: {},
  onInitialize(app) {
    const event = app.context.getEvent();
    event.on(CinoEventsName.AppInstall, ({ id, app: curApp }) => {
      if (curApp.getId() == app.self.getId()) {
        return;
      }
      if (curApp.getConfig().boot?.find((i) => i.type === 'docker')) {
        return;
      }
      this.appMap[curApp.getId()] = curApp;
    });
  },
  onActivate(app) {
    // 激活应用的时候创建一个窗口
    app.createView({
      title: '应用启动器',
      container: <AppBoot appMap={this.appMap} />,
      renderType: 'react',
      size: {
        width: 800,
        height: 400,
      },
    });
  },
});
