import { MarkmapPluginConfig } from './types'

/**
 * 生成唯一的 ID（用于脑图容器）
 * @param prefix - ID 前缀，默认为 'markmap'
 * @returns 生成的唯一 ID
 */
export const generateUniqueId = (prefix: string = 'markmap') => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const handlePropsArr = (props: object) => {
  const propsArray: string[] = []

  for (const [key, value] of Object.entries(props)) {
    switch (typeof value) {
      case 'string':
        propsArray.push(`${key}="${value}"`)
        break
      case 'number':
      case 'boolean':
        propsArray.push(`:${key}="${value}"`)
        break
    }
  }
  return propsArray
}

/**
 * 转换 Markdown 中的脑图容器为 Vue 组件标签
 * @param markdown - 原始 Markdown 内容
 * @returns 转换后的内容
 */
export function transformMarkmapContainers(markdown: string, options: MarkmapPluginConfig): string {
  const { name, ...globalProps } = options

  const componentId = generateUniqueId(name)
  const propsArray = handlePropsArr({ ...globalProps, id: componentId })

  const lines = markdown.split('\n')
  const transformedLines: string[] = []
  // 是否在代码块中
  let isCodeBlock = false
  // 是否是markmap容器
  let isMarkmapSpace = false

  lines.forEach((line) => {
    if (!isCodeBlock && line.startsWith('```')) {
      isCodeBlock = true
    } else if (isCodeBlock && line.startsWith('```')) {
      isCodeBlock = false
    }

    if (!isCodeBlock) {
      if (line.startsWith(`:::${name}`)) {
        isMarkmapSpace = true
        const markmapContainerStart = [
          '<ClientOnly>',
          `<${name} ${propsArray.join(' ')}>`,
          '<pre>',
        ]
        transformedLines.push(...markmapContainerStart)
        return
      }
      if (isMarkmapSpace && line.startsWith(':::')) {
        isMarkmapSpace = false
        const markmapContainerEnd = [
          '</pre>',
          `</${name}>`,
          '</ClientOnly>',
        ]
        transformedLines.push(...markmapContainerEnd)
        return
      }
      if (isMarkmapSpace) {
        if (line.trim() === '') return // 跳过空行
        // 转义标签符号
        line = line.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }
    }

    transformedLines.push(line)
  })

  return transformedLines.join('\n')
}
