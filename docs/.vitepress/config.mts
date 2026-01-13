/**
 * VitePress 配置文件 - 示例项目
 */

import { defineConfig } from 'vitepress'
import markmapPlugin from '@vitepress-plugin/markmap'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@vitePress-plugin',
  description: 'VitePress 插件系列，用于扩展 VitePress 文档',
  lang: 'zh-CN',

  ignoreDeadLinks: true,
  base: '/vitepress-plugin/',

  // 引入 Markmap 插件
  vite: {
    plugins: [
      markmapPlugin({
        name: 'markmap',
      }),
    ],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '🧠',

    nav: [
      { text: 'home', link: '/' },
      { text: 'markmap', items: [
        { text: '快速开始', link: '/markmap/' },
        { text: '使用示例', link: '/markmap/examples' },
        { text: '更新日志', link: '/markmap/logs' },
      ] },
    ],

    sidebar: {
      '/markmap': [{
        text: 'markmap',
        items: [
          { text: '快速开始', link: '/markmap/' },
          { text: '使用示例', link: '/markmap/examples' },
          { text: '更新日志', link: '/markmap/logs' },
        ],
      }]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/PaddyWang/vitepress-plugin' },
    ],

    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2025 PaddyWang',
    },
  },
})

