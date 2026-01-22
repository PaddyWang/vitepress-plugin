import type { Plugin } from 'vitepress'

import { transformCode } from './utils'
import { CodeviewPluginConfig } from './types'

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

const PluginName = `@vitepress-plugin/codeview`

export default function vitepressPluginCodeview (
  options: CodeviewPluginConfig = {}
): Plugin {
  const {
    name = 'codeview',
  } = options

  return {
    name: PluginName,

    enforce: 'pre',

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
        const newCode = transformCode(code, name)
        if (code !== newCode) {
          return {
            code: newCode,
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
