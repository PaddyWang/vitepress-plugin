import { test, expect } from 'vitest'
import { transformCode } from '../src/utils'


test('transformCode', () => {
  const code = `
:::codeview
---
code: markmap
text: 展开
activeText: 收起
---
:::markmap
---
theme: dark
---
# markmap
:::
:::
  `
  console.log(transformCode(code, 'codeview'))
})