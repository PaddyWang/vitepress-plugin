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


const observerRef = ref()
const flagId = 'markmap-dark-observer'
onMounted(() => {
  // 增加标记 防止注入多个监听
  if (!document.querySelector(`#${flagId}`)) {
    const flagEl = document.createElement('span')
    flagEl.style.display = 'none'
    flagEl.id = flagId
    document.body.appendChild(flagEl)

    const _handleDark = () => {
      const isDark = document.documentElement.classList.contains('dark')
      const isMmDark = document.documentElement.classList.contains('markmap-dark')
      if (isDark && !isMmDark) {
        document.documentElement.classList.add('markmap-dark')
      } else if (!isDark && isMmDark) {
        document.documentElement.classList.remove('markmap-dark')
      }
    }

    _handleDark()

    // 监听vitepress主题变化
    observerRef.value = new MutationObserver(_handleDark)

    observerRef.value.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
  }
})
onUnmounted(() => {
  const flagEl = document.querySelector(`#${flagId}`)
  if (flagEl) {
    observerRef.value?.disconnect()
    document.removeChild(flagEl)
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