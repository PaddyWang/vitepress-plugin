/**
 * Vite 构建配置文件
 * 用于构建 VitePress Markmap 插件库
 *
 * 构建产物：
 * - dist/index.es.js: ES 模块格式
 * - dist/markmap.es.js: Vue 组件（ES 模块）
 */

import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    // Vue 3 插件支持，用于处理 .vue 和 .tsx 文件中的 Vue 代码
    vue(),
    dts({
      entryRoot: 'src',
    }),
  ],

  build: {
    lib: {
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/Component.vue'),
      ],
      name: 'VitepressPluginMermaid',
      fileName: (format: string, name: string) => `${name}.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'vitepress',
        'vue',
        'virtual:global-config',
      ],

      output: {
        // 确保CSS包含在bundle中
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.names[0]?.endsWith('.css')) return 'style.css'
          return chunkInfo.names[0]
        },
      },
    },
  },
})
