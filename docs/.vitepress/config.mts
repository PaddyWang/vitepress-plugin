/**
 * VitePress 配置文件 - 示例项目
 */

import { defineConfig } from 'vitepress'
import markmapPlugin from '@vitepress-plugin/markmap'
import mermaidPlugin from '@vitepress-plugin/mermaid'
import codeviewPlugin from '@vitepress-plugin/codeview'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '@vitePress-plugin',
  description: 'VitePress 插件系列，用于扩展 VitePress 文档',
  lang: 'zh-CN',

  ignoreDeadLinks: true,
  base: '/vitepress-plugin/',

  markdown: {
    config(md) {
      console.log('>>>>>>>')
      // 自定义 Markdown 配置（如果需要）
    }
  },

  // 引入 Markmap 插件
  vite: {
    plugins: [
      codeviewPlugin({
        lang: 'md',
        text: 'code',
        activeText: '收起',
      }),
      markmapPlugin({
        name: 'markmap',
      }),
      mermaidPlugin({}),
    ],
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'home', link: '/' },
      { text: 'markmap', items: [
        { text: '快速开始', link: '/markmap/' },
        { text: '使用示例', link: '/markmap/examples' },
        { text: '更新日志', link: '/markmap/logs' },
      ] },
      { text: 'mermaid', items: [
        { text: '快速开始', link: '/mermaid/' },
        { text: '使用示例', link: '/mermaid/examples' },
        { text: '更新日志', link: '/mermaid/logs' },
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
      }],
      '/mermaid': [{
        text: 'mermaid',
        items: [
          { text: '快速开始', link: '/mermaid/' },
          { text: '使用示例', link: '/mermaid/examples' },
          { text: '更新日志', link: '/mermaid/logs' },
        ],
      }],
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

