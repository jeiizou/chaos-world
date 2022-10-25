import ModelLoaderPage from './pages/module-loader';
import IndexPage from './pages/index/index';

export const routes = [
  {
    name: '入口',
    path: '/',
    exact: true,
    component: IndexPage,
  },
  {
    name: '模型加载器',
    path: '/module-loader',
    exact: true,
    component: ModelLoaderPage,
  },
];
