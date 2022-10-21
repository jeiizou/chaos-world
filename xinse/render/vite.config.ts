import { defineConfig } from 'vite';
import path from 'path';
import vitePluginString from 'vite-plugin-string';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [(vitePluginString as any).default(), dts()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'xinse',
      // the proper extensions will be added
      fileName: 'xinse'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {}
    }
  }
});
