<template>
  <div class="markmap-container" ref="containerRef" :style="`height: ${handleSize(state.containerHeight)}`">
    <svg ref="svgRef"></svg>
  </div>
  <div style="display: none" ref="contentRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, onUnmounted } from 'vue'
import { Transformer, ITransformResult } from 'markmap-lib'
import { Markmap, IMarkmapOptions } from 'markmap-view'
import { Toolbar } from 'markmap-toolbar'

import type { themeType } from './types'

interface Props {
  containerHeight?: string | number,
  theme?: themeType,
}

const props = defineProps<Props>()

const containerRef = ref<HTMLDivElement>()
const svgRef = ref(null)
const contentRef = ref<HTMLDivElement>()

interface State {
  containerHeight?: string | number,
  theme?: themeType
}
const state = reactive<State>({
  containerHeight: props.containerHeight ?? 300,
  theme: props.theme
})

const handleSize = (size: any = '100%') => /%|px|rem|vh|vw|calc|var/.test(String(size)) ? size : `${size}px`

onMounted(async () => {
  const transformer = new Transformer()
  const loadSource = contentRef.value?.querySelector('pre')?.innerText || ''
  const { root, frontmatter } = transformer.transform(loadSource)
  if (frontmatter) {
    const { containerHeight, theme } = frontmatter as ITransformResult['frontmatter'] & State
    if (containerHeight) state.containerHeight = containerHeight
    if (theme) state.theme = theme
  }

  const { color, lineWidth, ...markmap } = frontmatter?.markmap || {}
  const config: Partial<IMarkmapOptions> = {
    spacingHorizontal: 24,
    spacingVertical: 10,
    maxInitialScale: 1,
    ...markmap,
  }
  if (color) config.color = () => color[0]
  if (lineWidth !== undefined) config.lineWidth = () => Array.isArray(lineWidth) ? lineWidth[0] : lineWidth
  const mm = Markmap.create(svgRef.value, config, root)

  const el = Toolbar.create(mm).setItems(['zoomIn', 'zoomOut', 'fit'])
  el.style.position = 'absolute'
  el.style.top = '10px'
  el.style.right = '10px'
  el.style.display = 'flex'
  containerRef.value?.appendChild(el)
})


const observerRef = ref()
const handleTheme = (theme: themeType | undefined = state.theme) => {
  if (!containerRef.value) return
  const mmDarkClassName = 'markmap-dark'
  const isDark = document.documentElement.classList.contains('dark')
  const isMmDark = containerRef.value.classList.contains('markmap-dark')
  if (theme) {
    if (theme === 'light' && isMmDark) {
      containerRef.value.classList.remove(mmDarkClassName)
    } else if (theme === 'dark' && !isMmDark) {
      containerRef.value.classList.add(mmDarkClassName)
    }
  } else {
    if (isDark && !isMmDark) {
      containerRef.value.classList.add(mmDarkClassName)
    } else if (!isDark && isMmDark) {
      containerRef.value.classList.remove(mmDarkClassName)
    }
  }
}
onMounted(() => {
  handleTheme()

  if (state.theme) return

  // 监听vitepress主题变化
  observerRef.value = new MutationObserver(() => handleTheme())

  observerRef.value.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})
onUnmounted(() => {
  observerRef.value?.disconnect()
})
</script>

<style>
.markmap-container {
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
}
.markmap-container > svg {
  width: 100%;
  height: 100%;
}
.mm-toolbar-brand {
  display: none;
}
.mm-toolbar-item {
  cursor: pointer;
}
</style>