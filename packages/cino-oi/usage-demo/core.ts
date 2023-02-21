import { Cino, CinoApplication } from 'cino';

// 初始化系统
const cino = new Cino();

const app = new CinoApplication({
  // 应用名称
  name: '应用A',
  // 应用ID
  id: 'xxx-xxx-xxx',
  // 应用资源路径
  resource: 'https://xxx.xxx.xxx/remote.js',
});

// 安装应用
cino.install(app);
// 卸载应用
cino.uninstall(app);

// 点击应用开始运行
app.activate();
// 关闭当前正在运行的应用
app.deactivate();
