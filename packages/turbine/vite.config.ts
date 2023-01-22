import { defineConfig } from 'vite';
import path from 'path';
import vitePluginString from 'vite-plugin-string';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';
import sassDts from 'vite-plugin-sass-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), (vitePluginString as any).default(), sassDts(), dts()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'xinse',
      // the proper extensions will be added
      fileName: 'xinse',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {},
    },
  },
});
