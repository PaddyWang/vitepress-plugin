import { test, expect } from 'vitest'
import { Transformer } from 'markmap-lib'

import { transformMarkmapContainers } from '../src/utils'
import markdown from './test'

test('markmap', () => {
  console.log(transformMarkmapContainers(markdown, {
    name: 'markmap'
  }))
})

// test('frontmatter', () => {
//   const transformer = new Transformer()
//   const loadSource = `
// ---  

// containerHeight: 500

// markmap:
//   color: red
// ---
  

// # 前端开发

// ## HTML
// ## CSS

// ## JavaScript
//   `
//   console.log('>', loadSource.split('\n').filter(line => line.trim() !== '').join('\n'))
// })