/**
 * VitePress Mermaid 插件类型定义
 * 提供插件配置和组件的 TypeScript 类型支持
 */

import type { Plugin } from 'vite'


/**
 * Mermaid 自定义容器的配置选项
 */
export interface CodeviewPluginConfig {
  /** 自定义容器的名称（在 markdown 中使用） */
  name?: string
  /** 配置全局 code lang */
  lang?: string
  /** 配置全局 text */
  text?: string
  /** 配置全局 active 状态下的 text */
  activeText?: string
  /** 配置全局 是否处于激活状态 */
  active?: boolean
  /** 配置全局 是否开启 shadow 模式  css 不会污染全局 */
  shadow?: boolean
}

/**
 * VitePress 插件返回类型
 */
export type CodeviewPlugin = Plugin & {
  name: string
  enforce?: 'pre' | 'post' | 'normal'
  apply?: 'serve' | 'build'
}
