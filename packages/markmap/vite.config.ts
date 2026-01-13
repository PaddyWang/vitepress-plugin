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

export default defineConfig({
  plugins: [
    // Vue 3 插件支持，用于处理 .vue 和 .tsx 文件中的 Vue 代码
    vue(),
  ],

  build: {
    lib: {
      // 库的名称（用于 UMD 构建）
      name: 'VitepressPluginMarkmap',

      // 入口文件 - 导出插件主函数
      entry: [
        resolve(__dirname, 'src/index.ts'),
        resolve(__dirname, 'src/markmap.vue'),
      ],
      fileName: (format, name) => `${name}.${format}.js`,
      formats: ['es']
    },

    // Rollup 选项 - 配置依赖的外部化和输出格式
    rollupOptions: {
      // 指定哪些包应该被外部化处理，不被打包进库中
      external: ['vue'],

      output: {
        // 确保CSS包含在bundle中
        assetFileNames: (chunkInfo) => {
          if (chunkInfo.names[0]?.endsWith('.css')) return 'style.css'
          return chunkInfo.names[0]
        },
      },
    },

    cssCodeSplit: true,

    // 构建输出配置
    outDir: 'dist',
    emptyOutDir: true,

    // 压缩配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // 保留 console 用于调试
      },
    },

    // Source Map 配置（生产构建中禁用以减小体积）
    sourcemap: false,

    // 目标浏览器版本
    target: 'esnext',
  },
})
