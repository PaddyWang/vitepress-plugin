# 使用示例

本页面展示了 VitePress Codeview 插件的各种使用方式和效果。

## 支持嵌套自定义容器渲染

```md
:::codeview
---
text: 展开查看源码
textActive: 点击收起
---
::: info
viewpress info 容器
:::
:::
```

:::codeview
---
text: 展开查看源码
textActive: 点击收起
---
::: info
viewpress info 容器
:::
:::

-------------------------

```md
:::codeview
::: danger
viewpress danger 容器
:::
:::
```
:::codeview
::: danger
viewpress danger 容器
:::
:::

-------------------------


```md
:::codeview
:::markmap
* markmap
  - 节点1
    + 节点1.1
    + 节点2.1
  - 节点2
    + 节点2.1
:::
:::
```
:::codeview
:::markmap
* markmap
  - 节点1
    + 节点1.1
    + 节点2.1
  - 节点2
    + 节点2.1
:::
:::

-------------------------



```md
:::codeview
---
lang: mermaid
---
:::mermaid
---
config:
  look: handDrawn
---
flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
:::
:::
```
:::codeview
---
lang: mermaid
---
:::mermaid
---
config:
  look: handDrawn
---
flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
:::
:::


## 支持HTML渲染 并且可以开启 shadow 模式

```md
:::codeview
---
lang: html
shadow: true
---
<div>div 渲染</div>
<style>
  div {
    background: pink;
  }
  body {
    background: red;
  }
</style>
:::
```
:::codeview
---
lang: html
shadow: true
---
<div>div 渲染</div>
<style>
  div {
    background: pink;
  }
  body {
    background: red;
  }
</style>
:::


## 支持 vue 组件导入渲染

```md
:::codeview
---
active: true
---
<<< ./Demo.vue
:::
```
:::codeview
---
active: true
---
<<< ./Demo.vue
:::


## 支持HTML 导入渲染 并且是在 shadow 中隔离渲染

```md
:::codeview
<<< ./demo.html
:::
```
:::codeview
<<< ./demo.html
:::
