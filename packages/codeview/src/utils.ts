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
  const scriptSetupFlag = '/* SCRIPT SETUP */'
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
  const importFilePathMap: Record<string, string> = {}

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
      // 开始标记
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
        const copyGlobalProps = { ...globalProps }
        // 合并配置
        Object.assign(copyGlobalProps, config)
        const { lang, ...props } = copyGlobalProps
        codeLang = lang || ''

        const markmapContainerStart = [
          '<ClientOnly>',
          `<${name} id="${uid}" ${objToVueAttr(props)}>`,
          '',
        ]
        transformedLines.push(...markmapContainerStart)
        continue
      }
      // 结束标记
      if (isCodeviewSpace && line.trim() === ':::') {
        if (containerStack.length === 0) {
          isCodeviewSpace = false

          const markmapContainerEnd = [
            `</${name}>`,
            '</ClientOnly>',
          ]
          // 判断有没有导入模块
          if (spaceCodeLines.join('').trim().startsWith('<<<')) {
            markmapContainerEnd.unshift(...[
              '',
              '<template #code>',
              '',
              ...spaceCodeLines,
              '',
              '</template>',
            ])
          } else {
            markmapContainerEnd.unshift(...[
              '',
              '<template #code>',
              '',
              '```' + codeLang,
              ...spaceCodeLines,
              '```',
              '',
              '</template>',
            ])
          }

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

        // 转义 style 和 script 标签
        if (line.trim() === '<style>' || line.trim() === '</style>' || line.trim() === '<script>' || line.trim() === '</script>') {
          line = line.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }

        // 导入代码处理(不在嵌套容器中)
        if (containerStack.length === 0 && line.startsWith('<<<')) {
          if (importFilePathMap[uid]) {
            throw new Error(`[@vitepress-plugin/codeview] Currently, only single-file import is supported:: ${line}`)
          } else {
            importFilePathMap[uid] = line
            // 在行尾再增加一个唯一标记
            line += uid
          }
        }
      }

      // 添加 script 标签 标记
      if (line.trim().startsWith('<script') && line.includes('setup')) {
        transformedLines.push(line)
        transformedLines.push(scriptSetupFlag)
        continue
      }
    }

    transformedLines.push(line)
  }

  let newCode = transformedLines.join('\n')

  // 处理导入文件
  const fileIds = Object.keys(importFilePathMap)
  if (fileIds.length) {
    const vuePaths: {id: string, path: string}[] = []
    fileIds.forEach(key => {
      const filePath = importFilePathMap[key]
      const idFlag = `id="${key}"`
      if (filePath.includes('.vue')) {
        vuePaths.push({ id: key, path: filePath })
        newCode = newCode.replace(idFlag, `${idFlag} importLang="vue"`)
      } else if (filePath.includes('.html')) {
        newCode = newCode.replace(idFlag, `${idFlag} importLang="html"`).replace(filePath + key, '')
      }
    })
    
    if (vuePaths.length) {
      const vueImport = vuePaths.map(file => {
        return file.path.replace(/^<<<\s+([^\s#{]+)/gm, (_, p2) => {
          const componentName = `C${file.id.replace(/-/g, '')}`
          newCode = newCode.replace(file.path + file.id, `<${componentName} />`)
          return `import ${componentName} from "${p2}"`
        })
      }).join('\n')
      if (newCode.includes(scriptSetupFlag)) {
        newCode = newCode.replace(scriptSetupFlag, scriptSetupFlag + '\n' + vueImport)
      } else {
        newCode += [
          '',
          '',
          '<script setup>',
          vueImport,
          '</script>',
        ].join('\n')
      }
    }
  }

  return newCode
}