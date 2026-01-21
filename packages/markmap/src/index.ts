/**
 * VitePress Markmap 插件主入口
 *
 * 这是一个 Vite 插件，用于：
 * 1. 在构建时自动转换 Markdown 中的脑图容器
 * 2. 注入 Markmap 组件
 * 3. 提供类型定义和导出
 *
 * 使用方式：
 * // vitepress/config.ts
 * import markmapPlugin from '@vitepress-plugin/markmap'
 *
 * export default defineConfig({
 *   plugins: [markmapPlugin()]
 * })
 */

import type { Plugin } from 'vite'
import { transformMarkmapContainers } from './utils'
import type { MarkmapPluginConfig } from './types'

/**
 * 获取文件扩展名
 * 替代 Node.js 的 path.extname，避免浏览器环境兼容性问题
 */
function getFileExtension(filepath: string): string {
  const lastDotIndex = filepath.lastIndexOf('.')
  const lastSlashIndex = Math.max(filepath.lastIndexOf('/'), filepath.lastIndexOf('\\'))
  
  if (lastDotIndex <= lastSlashIndex) {
    return ''
  }
  
  return filepath.slice(lastDotIndex)
}

/**
 * 创建 VitePress Markmap 插件
 *
 * 功能说明：
 * - 扫描 Markdown 文件中的 :::markmap 自定义容器
 * - 将容器内容转换为 Markmap 组件调用
 * - 自动注入脑图所需的依赖库（markmap-lib 和 markmap-view）
 *
 * @param options - 插件配置选项
 * @returns Vite 插件对象
 */
const PluginName = '@vitepress-plugin/markmap'
export default function markmapPlugin(options: MarkmapPluginConfig = {}): Plugin {
  // 合并默认选项
  const {
    name = 'markmap',
  } = options

  return {
    name: `vitepress-plugin-${name}`,

    // 在内容转换之前处理（确保在 Markdown 转换前执行）
    enforce: 'pre',

    /**
     * 核心转换钩子
     * 处理 Markdown 文件中的脑图容器
     *
     * @param code - 文件内容
     * @param id - 文件路径
     * @returns 转换后的内容
     */
    transform(code: string, id: string) {
      // 插入 注入组件的代码片段
      if (id.includes('/client/app/index')) {
        code = `import ${name} from '${PluginName}/markmap';\nimport '${PluginName}/style.css';\n${code}`
        code = code.replace('// install global components', (p) => {
          return `${p}\n    app.component('${name}', ${name});`
        })

        return {
          code,
          map: null
        }
      }

      // 只处理 Markdown 和 MDX 文件
      const ext = getFileExtension(id)
      if (!['.md', '.markdown', '.mdx'].includes(ext)) {
        return null
      }

      const transformed = transformMarkmapContainers(code, { ...options, name})

      // 如果内容被修改，返回新内容和 source map
      if (transformed !== code) {
        return {
          code: transformed,
          map: null, // 可以在生产环境中生成更详细的 source map
        }
      }

      return null
    },

    /**
     * Vite HMR 钩子
     * 配置热模块替换的行为
     */
    handleHotUpdate({ file, server }) {
      // 如果 Markdown 文件变化，通知客户端重新加载
      const ext = getFileExtension(file)
      if (ext === '.md') {
        console.log(`[${name}] Markdown 文件已修改: ${file}`)
        server.ws.send({
          type: 'custom',
          event: `${name}:update`,
          data: { file },
        })
      }
    },
  }
}

/**
 * 导出类型定义供用户使用
 */
export type { MarkmapPluginConfig } from './types'