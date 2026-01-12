# @vitepress-plugin/markmap

[![npm version](https://img.shields.io/npm/v/@vitepress-plugin/markmap)](https://www.npmjs.com/package/@vitepress-plugin/markmap)
[![license](https://img.shields.io/npm/l/@vitepress-plugin/markmap)](LICENSE)
[![downloads](https://img.shields.io/npm/dw/@vitepress-plugin/markmap)](https://www.npmjs.com/package/@vitepress-plugin/markmap)

一个强大的 VitePress 插件，用于在 Markdown 中优雅地渲染交互式脑图。基于 [markmap-lib](https://markmap.js.org/) 和 [markmap-view](https://markmap.js.org/) 构建。


## ✨ 特性

- 📝 **简单易用**：使用标准的 Markdown 容器语法，无需额外学习
- 🚀 **开箱即用**：自动注入所有必需的依赖和组件，无需额外配置
- ⚡ **高效能**：基于 markmap-lib 和 markmap-view，渲染性能优异
- 🎯 **灵活配置**：提供全局和局部的配置选项，满足多种需求

## 📦 安装

```bash
# 使用 npm
npm install @vitepress-plugin/markmap

# 使用 pnpm
pnpm add @vitepress-plugin/markmap

# 使用 yarn
yarn add @vitepress-plugin/markmap
```

## 🚀 快速开始

### 1. 配置插件

在 `.vitepress/config.mts` 中：

```typescript{2,7-10}
import { defineConfig } from 'vitepress'
import markmapPlugin from '@vitepress-plugin/markmap'

export default defineConfig({
  vite: {
    plugins: [
      markmapPlugin({
        width: '100%',
        height: '500px',
      }),
    ],
  },
})
```

### 2. 在 Markdown 中使用

```markdown
:::markmap
---
width: 100%
height: 500
---
# Root Node
* Branch 1
  -  Leaf 1.1
  -  Leaf 1.2
* Branch 2
  - Leaf 2.1
  - Leaf 2.2
:::
```

## 🎯 配置选项

### 插件级配置

| 选项 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `name` | string | `'markmap'` | 自定义容器名称 |
| `width` | string \| number | `'100%'` | 默认脑图宽度 |
| `height` | string \| number | `300px` | 默认脑图高度 |

### 容器级属性

在单个容器中可以覆盖全局配置：  
支持使用 YAML frontmatter，并使用 [gray-matter](https://github.com/jonschlinkert/gray-matter) 解析。frontmatter 必须位于 容器的顶部，并且需要在三条虚线之间采用有效的 YAML 格式。例如：

```md{2-4}
:::markmap
---
height: 500
---

...
:::
```

支持的属性：`width`、`height`

## 🏗️ 项目架构

```
/
├── src/
│   ├── index.ts          # 插件主入口
│   ├── markmap.vue       # Vue 3 脑图组件
│   ├── types.ts          # TypeScript 类型定义
│   └── utils.ts          # 工具函数（Markdown 解析等）
├── vite.config.ts        # Vite 构建配置
├── tsconfig.json         # TypeScript 配置
├── package.json          # 项目配置
└── README.md             # 项目文档
```

## 🔧 核心文件说明

### src/index.ts - 插件主文件

- 实现了 Vite 插件接口
- 自动转换 Markdown 中的脑图容器
- 处理热模块替换（HMR）
- 导出类型定义和工具函数

**关键功能**：
- `transform` 钩子：转换 Markdown 容器为组件调用
- `resolveId` 钩子：处理虚拟模块导入
- `load` 钩子：返回虚拟模块内容

### src/markmap.vue - Vue 3 组件

- 提供交互式脑图渲染
- 集成 markmap-lib（Markdown → 脑图结构）
- 集成 markmap-view（脑图可视化和交互）

**关键特性**：
- 响应式数据绑定
- 实时更新和重新渲染

### src/types.ts - 类型定义

提供完整的 TypeScript 类型支持：

```typescript
// 插件选项接口
export interface MarkmapPluginConfig

// Vue 组件 Props 接口
export interface MarkmapProps
```

## 🎨 样式定制

在 VitePress 主题中添加自定义 CSS：

```css
/* .vitepress/theme/custom.css */

.markmap-container {
  ...
}
```

## 🐛 常见问题

### Q: 脑图不显示？

A: 检查以下几点：
- Markdown 语法是否正确

### Q: 如何改变默认高度？

A: 在插件配置中设置 `height`，或在容器中指定 `height` 属性

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](https://github.com/paddywang/vitepress-plugin/LICENSE)

## 🔗 相关链接

- [Markmap 官网](https://markmap.js.org/)
- [markmap-lib](https://github.com/markmap/markmap)
- [VitePress 文档](https://vitepress.dev/)
- [Vite 插件文档](https://vitejs.dev/guide/api-plugin.html)

## 👨‍💻 作者

PaddyWang - [GitHub](https://github.com/PaddyWang)

---

**给个 Star ⭐ 如果这个项目对你有帮助！**
