# @vitepress-plugin/mermaid

[![npm version](https://img.shields.io/npm/v/@vitepress-plugin/mermaid)](https://www.npmjs.com/package/@vitepress-plugin/mermaid)
[![license](https://img.shields.io/npm/l/%40vitepress-plugin%2Fmermaid)](LICENSE)
[![downloads](https://img.shields.io/npm/dw/@vitepress-plugin/mermaid)](https://www.npmjs.com/package/@vitepress-plugin/mermaid)

一个强大的 VitePress 插件，用于在 Markdown 中优雅地渲染交互式图表。基于 [mermaid](https://mermaid.js.org/) 构建。


## ✨ 特性

- 📝 **简单易用**：使用标准的 Markdown 容器语法，无需额外学习
- 🚀 **开箱即用**：自动注入所有必需的依赖和组件，无需额外配置
- ⚡ **高效能**：基于 mermaid 渲染性能优异
- 🎯 **灵活配置**：提供全局和局部的配置选项，满足多种需求

## 📦 安装

```bash
# 使用 npm
npm install @vitepress-plugin/mermaid

# 使用 pnpm
pnpm add @vitepress-plugin/mermaid

# 使用 yarn
yarn add @vitepress-plugin/mermaid
```

## 🚀 快速开始

### 1. 配置插件

在 `.vitepress/config.mts` 中：

```typescript{2,7}
import { defineConfig } from 'vitepress'
import mermaidPlugin from '@vitepress-plugin/mermaid'

export default defineConfig({
  vite: {
    plugins: [
      mermaidPlugin(),
    ],
  },
})
```

### 2. 在 Markdown 中使用

```markdown
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
```

## 🎯 配置选项

### 插件级配置

| 选项 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `name` | string | `'mermaid'` | 自定义容器名称 |
| `containerStyle` | object | / | 全局自定义容器样式(所有支持的CSS样式) |
| `config` | MermaidConfig | / | 全局自定义图表配置 |

### 容器级属性

在单个容器中可以覆盖全局配置：  
支持使用 YAML frontmatter，并使用 [gray-matter](https://github.com/jonschlinkert/gray-matter) 解析。frontmatter 必须位于 容器的顶部，并且需要在三条虚线之间采用有效的 YAML 格式。例如：

```md{2-6}
:::mermaid
---
containerStyle:
  background: transparent
config:
  theme: dark
---

...
:::
```



| 选项 | 类型 | 默认值 | 说明 |
|-----|------|--------|------|
| `containerStyle` | object | / | 自定义容器样式 |
| `config` | MermaidConfig | / | 自定义图表配置 |

```ts
interface MermaidConfig {
  /**
   * Theme, the CSS style sheet.
   * You may also use `themeCSS` to override this value.
   *
   */
  theme?: 'default' | 'base' | 'dark' | 'forest' | 'neutral' | 'null';
  themeVariables?: any;
  themeCSS?: string;
  /**
   * Defines which main look to use for the diagram.
   *
   */
  look?: 'classic' | 'handDrawn';
  /**
   * Defines the seed to be used when using handDrawn look. This is important for the automated tests as they will always find differences without the seed. The default value is 0 which gives a random seed.
   *
   */
  handDrawnSeed?: number;
  /**
   * Defines which layout algorithm to use for rendering the diagram.
   *
   */
  layout?: string;
  /**
   * The maximum allowed size of the users text diagram
   */
  maxTextSize?: number;
  /**
   * Defines the maximum number of edges that can be drawn in a graph.
   *
   */
  maxEdges?: number;
  elk?: {
    /**
     * Elk specific option that allows edges to share path where it convenient. It can make for pretty diagrams but can also make it harder to read the diagram.
     *
     */
    mergeEdges?: boolean;
    /**
     * Elk specific option affecting how nodes are placed.
     *
     */
    nodePlacementStrategy?: 'SIMPLE' | 'NETWORK_SIMPLEX' | 'LINEAR_SEGMENTS' | 'BRANDES_KOEPF';
    /**
     * This strategy decides how to find cycles in the graph and deciding which edges need adjustment to break loops.
     *
     */
    cycleBreakingStrategy?: 'GREEDY' | 'DEPTH_FIRST' | 'INTERACTIVE' | 'MODEL_ORDER' | 'GREEDY_MODEL_ORDER';
    /**
     * The node order given by the model does not change to produce a better layout. E.g. if node A is before node B in the model this is not changed during crossing minimization. This assumes that the node model order is already respected before crossing minimization. This can be achieved by setting considerModelOrder.strategy to NODES_AND_EDGES.
     *
     */
    forceNodeModelOrder?: boolean;
    /**
     * Preserves the order of nodes and edges in the model file if this does not lead to additional edge crossings. Depending on the strategy this is not always possible since the node and edge order might be conflicting.
     *
     */
    considerModelOrder?: 'NONE' | 'NODES_AND_EDGES' | 'PREFER_EDGES' | 'PREFER_NODES';
  };
  darkMode?: boolean;
  htmlLabels?: boolean;
  /**
   * Specifies the font to be used in the rendered diagrams.
   * Can be any possible CSS `font-family`.
   * See https://developer.mozilla.org/en-US/docs/Web/CSS/font-family
   *
   */
  fontFamily?: string;
  altFontFamily?: string;
  /**
   * This option decides the amount of logging to be used by mermaid.
   *
   */
  logLevel?: 'trace' | 0 | 'debug' | 1 | 'info' | 2 | 'warn' | 3 | 'error' | 4 | 'fatal' | 5;
  /**
   * Level of trust for parsed diagram
   */
  securityLevel?: 'strict' | 'loose' | 'antiscript' | 'sandbox';
  /**
   * Dictates whether mermaid starts on Page load
   */
  startOnLoad?: boolean;
  /**
   * Controls whether or arrow markers in html code are absolute paths or anchors.
   * This matters if you are using base tag settings.
   *
   */
  arrowMarkerAbsolute?: boolean;
  /**
   * This option controls which `currentConfig` keys are considered secure and
   * can only be changed via call to `mermaid.initialize`.
   * This prevents malicious graph directives from overriding a site's default security.
   *
   */
  secure?: string[];
  /**
   * This option specifies if Mermaid can expect the dependent to include KaTeX stylesheets for browsers
   * without their own MathML implementation. If this option is disabled and MathML is not supported, the math
   * equations are replaced with a warning. If this option is enabled and MathML is not supported, Mermaid will
   * fall back to legacy rendering for KaTeX.
   *
   */
  legacyMathML?: boolean;
  /**
   * This option forces Mermaid to rely on KaTeX's own stylesheet for rendering MathML. Due to differences between OS
   * fonts and browser's MathML implementation, this option is recommended if consistent rendering is important.
   * If set to true, ignores legacyMathML.
   *
   */
  forceLegacyMathML?: boolean;
  /**
   * This option controls if the generated ids of nodes in the SVG are
   * generated randomly or based on a seed.
   * If set to `false`, the IDs are generated based on the current date and
   * thus are not deterministic. This is the default behavior.
   *
   * This matters if your files are checked into source control e.g. git and
   * should not change unless content is changed.
   *
   */
  deterministicIds?: boolean;
  /**
   * This option is the optional seed for deterministic ids.
   * If set to `undefined` but deterministicIds is `true`, a simple number iterator is used.
   * You can set this attribute to base the seed on a static string.
   *
   */
  deterministicIDSeed?: string;
  flowchart?: FlowchartDiagramConfig;
  sequence?: SequenceDiagramConfig;
  gantt?: GanttDiagramConfig;
  journey?: JourneyDiagramConfig;
  timeline?: TimelineDiagramConfig;
  class?: ClassDiagramConfig;
  state?: StateDiagramConfig;
  er?: ErDiagramConfig;
  pie?: PieDiagramConfig;
  quadrantChart?: QuadrantChartConfig;
  xyChart?: XYChartConfig;
  requirement?: RequirementDiagramConfig;
  architecture?: ArchitectureDiagramConfig;
  mindmap?: MindmapDiagramConfig;
  kanban?: KanbanDiagramConfig;
  gitGraph?: GitGraphDiagramConfig;
  c4?: C4DiagramConfig;
  sankey?: SankeyDiagramConfig;
  packet?: PacketDiagramConfig;
  block?: BlockDiagramConfig;
  radar?: RadarDiagramConfig;
  dompurifyConfig?: DOMPurifyConfiguration;
  wrap?: boolean;
  fontSize?: number;
  markdownAutoWrap?: boolean;
  /**
   * Suppresses inserting 'Syntax error' diagram in the DOM.
   * This is useful when you want to control how to handle syntax errors in your application.
   *
   */
  suppressErrorRendering?: boolean;
}
```


## 🏗️ 项目架构

```
/
├── src/
│   ├── Component.vue     # Vue 3 渲染组件
│   ├── index.ts          # 插件主入口
│   └── types.ts          # TypeScript 类型定义
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
- 自动转换 Markdown 中的图表容器
- 处理热模块替换（HMR）
- 导出类型定义和工具函数

**关键功能**：
- `transform` 钩子：转换 Markdown 容器为组件调用

### src/Component.vue - Vue 3 组件

- 提供交互式图表渲染
- 集成 mermaid（Markdown → 图表）

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
  --mermaid-width: 100%;
  --mermaid-height: auto;
  --mermaid-border-radius: 8px;
  --mermaid-background: var(--vp-c-bg-alt);
}
```


## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License - 详见 [LICENSE](https://github.com/paddywang/vitepress-plugin/LICENSE)

## 🔗 相关链接

- [Mermaid 官网](https://mermaid.js.org/)
- [VitePress 文档](https://vitepress.dev/)
- [Vite 插件文档](https://vitejs.dev/guide/api-plugin.html)

## 👨‍💻 作者

PaddyWang - [GitHub](https://github.com/PaddyWang)

---

**给个 Star ⭐ 如果这个项目对你有帮助！**
