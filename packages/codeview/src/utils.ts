import matter from 'gray-matter'

import { CodeviewPluginConfig } from './types'

/**
 * 生成唯一的 ID（用于组件唯一标记）
 * @returns 生成的唯一 ID
 */
const generateUniqueId = (prefix: string = '') => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

/*
:::markmap
....
:::

转换成

<ClientOnly>
<Codeview>
:::markmap
....
:::
<template #code>

```md
:::markmap
....
:::
```

</template>
</Codeview>
</ClientOnly>
*/

const objToVueAttr = (props: object) => {
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
  return propsArray.join(' ')
}

export const transformCode = (code: string, options: CodeviewPluginConfig) => {
  const { name, ...globalProps } = options
  const lines = code.split('\n')
  const transformedLines: string[] = []
  // 是否在代码块中
  let isCodeBlock = false
  // 是否是 Codeview 容器
  let isCodeviewSpace = false
  let uid: string = ''
  // codeview 容器内代码列表
  let spaceCodeLines: string[] = []
  // codeview 容器内 的 自定义容器
  const containerStack: string[] = []
  // 设置的语言
  let codeLang: string = ''

  const len = lines.length
  for (let index = 0; index < len; index++) {
    let line = lines[index]

    // 判断是否在代码块中
    if (!isCodeBlock && line.startsWith('```')) {
      isCodeBlock = true
    } else if (isCodeBlock && line.startsWith('```')) {
      isCodeBlock = false
    }

    // 只解析非代码块中的容器
    if (!isCodeBlock) {
      // 开始
      if (new RegExp(`^:::\\s*${name}`).test(line) && !isCodeviewSpace) {
        isCodeviewSpace = true
        spaceCodeLines = []
        uid = generateUniqueId(name)

        // 处理容器配置
        const configLines = []
        let i = index + 1
        if (lines[i]?.trim() === '---') {
          configLines.push(lines[i])
          while (i++ < lines.length) {
            const _line = lines[i]
            configLines.push(_line)
            if (_line.trim() === '---') break
          }
          // 改变 index 指针 越过配置信息
          index = i
        }

        const { data: config } = matter(configLines.join('\n'))
        // 合并配置
        Object.assign(globalProps, config)
        const { lang, ...props } = globalProps
        codeLang = lang || ''

        const markmapContainerStart = [
          '<ClientOnly>',
          `<${name} id="${uid}" ${objToVueAttr(props)}>`,
        ]
        transformedLines.push(...markmapContainerStart)
        continue
      }
      // 结束
      if (isCodeviewSpace && line.trim() === ':::') {
        if (containerStack.length === 0) {
          isCodeviewSpace = false

          const markmapContainerEnd = [
            '<template #code>',
            '',
            '```' + codeLang,
            ...spaceCodeLines,
            '```',
            '',
            '</template>',
            `</${name}>`,
            '</ClientOnly>',
          ]
          transformedLines.push(...markmapContainerEnd)
          continue
        } else {
          containerStack.pop()
        }
      }
      if (isCodeviewSpace) {
        spaceCodeLines.push(line)

        // 嵌套容器
        if (/^:::\s*\S+/.test(line)) {
          containerStack.push(line)
        }
      }
    }

    transformedLines.push(line)
  }

  return transformedLines.join('\n')
}