# 使用示例

本页面展示了 VitePress Markmap 插件的各种使用方式和效果。

## 示例 1：基础脑图
最简单的脑图示例，包含一个根节点和若干子节点：
:::codeview
:::markmap
# 前端开发
## HTML
## CSS
## JavaScript
:::
:::


## 示例 2：多层级脑图
展示如何创建多层级的树形结构：
:::codeview
:::markmap
* 前端开发
  - HTML
    + `<div>`
  - CSS
    + `flex`
  - JavaScript
    + `console.log('123')`
:::
:::


## 示例 2：自定义配置
展示容器自定义配置
:::codeview
:::markmap
---
containerHeight: 500
theme: light
markmap:
  color: red
  maxInitialScale: 2
  spacingVertical: 16
  spacingHorizontal: 50
  zoom: false
  pan: false
  toggleRecursively: true
---
# 前端开发
## HTML
## CSS
## JavaScript
:::
:::

---

**提示**：所有脑图都支持实时交互：
- 🔍 **缩放**：支持缩放
- ⚡ **响应式**：自动适应容器宽度
