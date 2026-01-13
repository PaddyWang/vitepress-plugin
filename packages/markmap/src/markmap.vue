<template>
  <div class="markmap-container" ref="containerRef" :style="`height: ${handleSize(state.containerHeight)}`">
    <svg ref="svgRef"></svg>
  </div>
  <div style="display: none" ref="contentRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect, reactive } from 'vue'
import { useData } from 'vitepress'
import { Transformer, ITransformResult } from 'markmap-lib'
import { Markmap, IMarkmapOptions } from 'markmap-view'
import { Toolbar } from 'markmap-toolbar'

interface Props {
  matter?: string
}
const { matter } = defineProps<Props>()

const { isDark } = useData()

const containerRef = ref<HTMLDivElement>()
const svgRef = ref(null)
const contentRef = ref<HTMLDivElement>()

const handleSize = (size: any = '100%') => /%|px|rem$/.test(String(size)) ? size : `${size}px`

interface State {
  containerHeight?: string | number
}
const state = reactive<State>({
  containerHeight: 300
})

watchEffect(() => {
  if (isDark.value) {
    document.documentElement.classList.add('markmap-dark')
  } else {
    document.documentElement.classList.remove('markmap-dark')
  }
})

onMounted(async () => {
  const transformer = new Transformer()
  const loadSource = contentRef.value?.querySelector('pre')?.innerText || ''
  const { root, frontmatter } = transformer.transform(loadSource)
  if (frontmatter) {
    const { containerHeight } = frontmatter as ITransformResult['frontmatter'] & State
    if (containerHeight) state.containerHeight = containerHeight
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