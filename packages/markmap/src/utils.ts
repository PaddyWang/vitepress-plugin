import { MarkmapPluginConfig } from './types'

/**
 * Markdown 解析和格式化工具函数
 * 用于处理自定义容器的提取、验证和转换
 */


/**
 * 正则表达式：匹配 :::markmap 自定义容器
 * 支持格式：
 * :::markmap
 * markmap content
 * :::
 */

/**
 * 生成唯一的 ID（用于脑图容器）
 * @param prefix - ID 前缀，默认为 'markmap'
 * @returns 生成的唯一 ID
 */
export const generateUniqueId = (prefix: string = 'markmap') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`


/**
 * 转换 Markdown 中的脑图容器为 Vue 组件标签
 * @param markdown - 原始 Markdown 内容
 * @returns 转换后的内容
 */
export function transformMarkmapContainers(markdown: string, options: MarkmapPluginConfig): string {
  const { name } = options
  const MARKMAP_CONTAINER_REGEX = new RegExp(`(?:^|\n)(:::\\s*${name}(?: +(.*?))?\n([\\s\\S]*?)\n:::)`, 'gm')

  // 使用专门的函数来替换，保留原有的内容结构
  return markdown.replace(MARKMAP_CONTAINER_REGEX, (match: string, fullMatch: string, _title: string, content: string) => {
    // 检查前面的字符，确保不在代码块中
    const matchIndex = match.indexOf(fullMatch)
    const position = markdown.indexOf(match) + matchIndex
    const beforeMatch = markdown.slice(0, position)
    
    // 检查前面是否有未关闭的代码块
    const codeBlocks = (beforeMatch.match(/```/g) || []).length
    const isInCodeBlock = codeBlocks % 2 === 1  // 奇数个 ``` 表示在代码块中
    
    if (isInCodeBlock) {
      // 如果在代码块中，直接返回原匹配内容，不做处理
      return match
    }

    // 生成组件属性字符串
    const componentId = generateUniqueId(name)
    const propsArray: string[] = [`id="${componentId}"`]

    const contentAfter = content
                          // 去掉---下面的空行 为了避免markdown语法转换
                          .replace(/---\s*\n([\s\n])+/g, (match) => match.split('\n').filter(line => line.trim() !== '').join('') + '\n')
                          // 转移掉标签符号
                          .replace(/</g, '&lt;').replace(/>/g, '&gt;').trim()

    console.log('>>content', content.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim())

    // 生成组件源码 <markmap><pre>content</pre></markmap>
    return `
<${name} ${propsArray.join(' ')}>
<pre>
${contentAfter}
</pre>
</${name}>
    `
  })
}
