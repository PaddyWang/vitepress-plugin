# 使用示例

本页面展示了 VitePress Markmap 插件的各种使用方式和效果。

## 示例 1：基础脑图

最简单的脑图示例，包含一个根节点和若干子节点：

```md
:::markmap
# 前端开发
## HTML
## CSS
## JavaScript
:::
```

:::markmap

# 前端开发
## HTML
## CSS
## JavaScript
:::

## 示例 2：多层级脑图

展示如何创建多层级的树形结构：
```md
:::markmap
* 前端开发
  - HTML
    + `<div>`
  - CSS
    + `flex`
  - JavaScript
    + `console.log('123')`
:::
```

:::markmap

* 前端开发
  - HTML
    + `<div>`
  - CSS
    + `flex`
  - JavaScript
    + `console.log('123')`
:::


---

**提示**：所有脑图都支持实时交互：
- 🔍 **缩放**：暂时不支持
- ⚡ **响应式**：自动适应容器宽度
