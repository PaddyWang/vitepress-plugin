# @vitepress-plugin/codeview

[![npm version](https://img.shields.io/npm/v/@vitepress-plugin/codeview)](https://www.npmjs.com/package/@vitepress-plugin/codeview)
[![license](https://img.shields.io/npm/l/%40vitepress-plugin%2Fcodeview)](LICENSE)
[![downloads](https://img.shields.io/npm/dw/@vitepress-plugin/codeview)](https://www.npmjs.com/package/@vitepress-plugin/codeview)

一个强大的 VitePress 插件，用于在 Markdown 中优雅地渲染代码的渲染和代码的展示


## ✨ 特性

- 📝 **简单易用**：使用标准的 Markdown 容器语法，无需额外学习
- 🚀 **开箱即用**：自动注入所有必需的依赖和组件，无需额外配置
- 🎯 **灵活配置**：提供全局和局部的配置选项，满足多种需求

## 📦 安装

```bash
# 使用 npm
npm install @vitepress-plugin/codeview

# 使用 pnpm
pnpm add @vitepress-plugin/codeview

# 使用 yarn
yarn add @vitepress-plugin/codeview
```

## 🚀 快速开始

### 1. 配置插件

在 `.vitepress/config.mts` 中：

```typescript{2,7-10}
import { defineConfig } from 'vitepress'
import codeviewPlugin from '@vitepress-plugin/codeview'

export default defineConfig({
  vite: {
    plugins: [
      codeviewPlugin({
        text: '显示代码',
        activeText: '收起',
      }),
    ],
  },
})
```

### 2. 在 Markdown 中使用
只需要将渲染内容包裹起来  

```markdown
:::codeview
:::mermaid
---
containerStyle:
  background: transparent
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

## 🎯 配置选项

### 插件级配置

| 选项 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `name` | string | `'mermaid'` | 自定义容器名称 |
| `text` | string | / | 全局自定义 text |
| `activeText` | string | / | 全局自定义激活时 text |

### 容器级属性

在单个容器中可以覆盖全局配置：  
支持使用 YAML frontmatter，并使用 [gray-matter](https://github.com/jonschlinkert/gray-matter) 解析。frontmatter 必须位于 容器的顶部，并且需要在三条虚线之间采用有效的 YAML 格式。例如：

```md{2,3}
:::mermaid
---
text: code
activeText: 收起
---

...
:::
```

容器级配置同全局配置 优先级大于全局配置。


## 🏗️ 项目架构

```
/
├── src/
│   ├── Component.vue     # Vue 3 渲染组件
│   ├── index.ts          # 插件主入口
│   ├── types.ts          # TypeScript 类型定义
│   └── utils.ts          # 工具函数（Markdown 解析等）
├── CHANGELOG.md          # 更新日志
├── LICENSE               # LICENSE
├── package.json          # 项目配置
├── README.md             # 项目文档
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 构建配置
```

## 🔧 核心文件说明

### src/index.ts - 插件主文件

- 实现了 Vite 插件接口
- 处理热模块替换（HMR）
- 导出类型定义

**关键功能**：
- `transform` 钩子：转换 Markdown 容器为组件调用

### src/Component.vue - Vue 3 组件

- 提供交互式组件渲染

**关键特性**：
- 响应式数据绑定
- 实时更新和重新渲染

### src/types.ts - 类型定义

提供完整的 TypeScript 类型支持

## 🎨 样式定制

在 VitePress 主题中添加自定义 CSS：

```css
/* .vitepress/theme/custom.css */

:root {
  /* 容器宽度 */
  --codeview-width: 100%;
  /* 高亮颜色 */
  --codeview-color: var(--vp-c-text-3);
  /* 容器边框圆角半径 */
  --codeview-border-radius: 8px;
}
```


## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](https://github.com/paddywang/vitepress-plugin/LICENSE)

## 🔗 相关链接

- [VitePress 文档](https://vitepress.dev/)
- [Vite 插件文档](https://vitejs.dev/guide/api-plugin.html)

## 👨‍💻 作者

PaddyWang - [GitHub](https://github.com/PaddyWang)

---

**给个 Star ⭐ 如果这个项目对你有帮助！**
