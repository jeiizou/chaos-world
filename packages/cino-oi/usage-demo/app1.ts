import { CinoApi } from 'cino';

// 创建应用配置
const AppConfig = CinoApi.createApp({
  // 应用被激活
  onActivate: (context: CinoApi) => {
    // 应用被激活的时候创建一个窗口
    const window = context.createInterFace({
      title: '简单应用的主要窗口',
      size: {
        width: 200,
        height: 300,
        maxWidth: 300,
        minWidth: 100,
      },
      app: <App />,
    });
  },
  // 应用被卸载
  onDeactivate: () => {},
});

export default AppConfig;
