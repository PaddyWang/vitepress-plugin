/**
 * VitePress Markmap 插件类型定义
 * 提供插件配置和组件的 TypeScript 类型支持
 */

import { Plugin } from 'vite'

/**
 * Markmap 自定义容器的配置选项
 */
export interface MarkmapPluginConfig {
  /** 自定义容器的名称（在 markdown 中使用） */
  name?: string
  /** 默认的脑图宽度 */
  width?: string | number
  /** 默认的脑图高度 */
  height?: string | number
  /** 是否启用缩放功能 */
  zoom?: boolean
  /** 是否启用拖拽功能 */
  pan?: boolean
}

/**
 * Markmap 组件的 Props 类型
 */
export interface MarkmapProps {
  /** Markdown 格式的脑图数据 */
  content: string
  /** 脑图的宽度 */
  width?: string | number
  /** 脑图的高度 */
  height?: string | number
  /** 是否启用缩放 */
  zoom?: boolean
  /** 是否启用拖拽 */
  pan?: boolean
}

/**
 * VitePress 插件返回类型
 */
export type MarkmapPlugin = Plugin & {
  name: string
  enforce?: 'pre' | 'post' | 'normal'
  apply?: 'serve' | 'build'
}
