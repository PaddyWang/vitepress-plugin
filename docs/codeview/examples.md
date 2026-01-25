# 使用示例

本页面展示了 VitePress Codeview 插件的各种使用方式和效果。

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

---

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

---

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

---

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

---

```md
:::codeview
---
lang: html
---
<div style="background: pink;">div 渲染</div>
:::
```
:::codeview
---
lang: html
---
<div style="background: pink;">div 渲染</div>
:::