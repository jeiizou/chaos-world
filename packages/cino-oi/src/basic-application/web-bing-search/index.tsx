import { Cino } from '@/lib-entry';
import AppIconSvg from '@/common/assets/imgs/app.svg';

export const BingSearchApp = Cino.createApp({
  id: 'web-bing-search',
  name: 'Bing搜索',
  config: {
    icon: {
      src: AppIconSvg,
    },
  },
  onInitialize: (app) => {
    // console.log('应用初始化');
  },
  onActivate: (app) => {
    // 激活应用的时候创建一个窗口
    app.createView({
      title: 'Search Bing',
      renderType: 'iframe',
      url: 'https://www.bing.com',
      size: {
        width: 800,
        height: 400,
      },
    });
  },
});
