import type { Plugin } from 'vitepress'
import matter from 'gray-matter'

import { MermaidPluginConfig } from './types'

/**
 * 生成唯一的 ID（用于脑图容器）
 * @param prefix - ID 前缀，默认为 'mermaid'
 * @returns 生成的唯一 ID
 */
const generateUniqueId = (prefix: string = 'mermaid') => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

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

const virtualModuleId = 'virtual:global-config'
const resolvedVirtualModuleId = '\0' + virtualModuleId
const PluginName = `@vitepress-plugin/mermaid`
const globalData: {
  globalConfig: Record<string, any>
  [uid: string]: any
} = {
  globalConfig: {}
}

export default function vitepressPluginMermaid (
  options: MermaidPluginConfig = {}
): Plugin {
  const {
    name = 'mermaid',
    ...globalOptions
  } = options

  globalData.globalConfig = globalOptions

  return {
    name: PluginName,

    enforce: 'pre',

    async resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(this, id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(globalData)};`;
      }
    },

    transform (code, id) {
      // 插入 注入组件的代码片段
      if (id.includes('/client/app/index')) {
        code = `import ${name} from '${PluginName}/Component';\nimport '${PluginName}/style.css';\n${code}`
        code = code.replace('// install global components', (p) => {
          return `${p}\n    app.component('${name}', ${name});`
        })

        return {
          code,
          map: null
        }
      } else if (id.endsWith('.md')) {
        const lines = code.split('\n')
        const transformedLines: string[] = []
        // 是否在代码块中
        let isCodeBlock = false
        // 是否是 mermaid 容器
        let isMermaidSpace = false
        let mermaidLines: string[] = []
        let uid: string

        lines.forEach((line) => {
          if (!isCodeBlock && line.startsWith('```')) {
            isCodeBlock = true
          } else if (isCodeBlock && line.startsWith('```')) {
            isCodeBlock = false
          }

          if (!isCodeBlock) {
            // 开始
            if (line.startsWith(`:::${name}`)) {
              isMermaidSpace = true
              uid = generateUniqueId()
              const markmapContainerStart = [
                '<ClientOnly>',
                `<${name} id="${uid}">`,
                '<pre>',
              ]
              transformedLines.push(...markmapContainerStart)
              return
            }
            // 结束
            if (isMermaidSpace && line.startsWith(':::')) {
              isMermaidSpace = false
              const markmapContainerEnd = [
                '</pre>',
                `</${name}>`,
                '</ClientOnly>',
              ]
              transformedLines.push(...markmapContainerEnd)
              const { data } = matter(mermaidLines.join('\n'))
              mermaidLines = []
              globalData[uid] = data
              return
            }
            if (isMermaidSpace) {
              if (line.trim() === '') return // 跳过空行
              // 转义标签符号
              line = line.replace(/</g, '&lt;').replace(/>/g, '&gt;')
              mermaidLines.push(line)
            }
          }

          transformedLines.push(line)
        })
        const transformedCode = transformedLines.join('\n')

        if (code !== transformedCode) {
          return {
            code: transformedCode,
            map: null,
          }
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
