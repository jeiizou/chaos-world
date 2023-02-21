import { defineConfig } from 'vite';
import sassDts from 'vite-plugin-sass-dts';
import dts from 'vite-plugin-dts';
import { join, resolve } from 'path';
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solidPlugin(), sassDts(), dts()],
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      '@core': join(__dirname, 'src/core'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib-entry.ts'),
      name: 'cino',
      // the proper extensions will be added
      fileName: 'cino',
    },
    rollupOptions: {
      // // 确保外部化处理那些你不想打包进库的依赖
      // external: ['react', 'react-dom'],
      // output: {
      //   // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      //   globals: {
      //     react: 'React',
      //     'react-dom': 'ReactDOM',
      //   },
      // },
    },
  },
});
