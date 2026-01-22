import matter from 'gray-matter'

/**
 * 生成唯一的 ID（用于脑图容器）
 * @param prefix - ID 前缀，默认为 'codeview'
 * @returns 生成的唯一 ID
 */
const generateUniqueId = (prefix: string = 'codeview') => `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`


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

export const transformCode = (code: string, name: string) => {
  const lines = code.split('\n')
  const transformedLines: string[] = []
  // 是否在代码块中
  let isCodeBlock = false
  // 是否是 Codeview 容器
  let isCodeviewSpace = false
  let uid: string
  let spaceCodeLines: string[] = []
  const containerStack: string[] = []

  lines.forEach((line) => {
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
        uid = generateUniqueId()
        const markmapContainerStart = [
          '<ClientOnly>',
          `<${name} id="${uid}">`,
        ]
        transformedLines.push(...markmapContainerStart)
        return
      }
      // 结束
      if (isCodeviewSpace && line.trim() === ':::') {
        if (containerStack.length === 0) {
          isCodeviewSpace = false
          const markmapContainerEnd = [
            '<template #code>',
            '',
            '```md',
            ...spaceCodeLines,
            '```',
            '',
            '</template>',
            `</${name}>`,
            '</ClientOnly>',
          ]
          transformedLines.push(...markmapContainerEnd)
          console.log('>>>>', matter(spaceCodeLines.join('\n')))
          return
        } else {
          containerStack.pop()
        }
      }
      if (isCodeviewSpace) {
        // 转义标签符号
        line = line.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        spaceCodeLines.push(line)

        // 嵌套容器
        if (/^:::\s*\S+/.test(line)) {
          containerStack.push(line)
        }
      }
    }

    transformedLines.push(line)
  })

  return transformedLines.join('\n')
}