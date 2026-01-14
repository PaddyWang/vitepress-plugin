/**
 * VitePress Markmap 插件类型定义
 * 提供插件配置和组件的 TypeScript 类型支持
 */

import { Plugin } from 'vite'


export type themeType = 'light' | 'dark'

/**
 * Markmap 自定义容器的配置选项
 */
export interface MarkmapPluginConfig {
  /** 自定义容器的名称（在 markdown 中使用） */
  name?: string
  /** 脑图容器的高度，可以是数字（像素）或字符串（CSS 单位） */
  containerHeight?: string | number
  /** 主题设置，支持 'light' 或 'dark' */
  theme?: themeType
}

/**
 * VitePress 插件返回类型
 */
export type MarkmapPlugin = Plugin & {
  name: string
  enforce?: 'pre' | 'post' | 'normal'
  apply?: 'serve' | 'build'
}
