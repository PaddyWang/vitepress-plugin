<template>
  <div class="markmap-container">
    <svg ref="svgRef" :style="style"></svg>
  </div>
  <div style="display: none" ref="contentRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'

interface Props {
  width?: number | string
  height?: number | string
}

const props = defineProps<Props>()

const handleSize = (size: any = '100%') => /%|px|rem$/.test(String(size)) ? size : `${size}px`
const style = computed(() => `
  width: ${handleSize(props.width)};
  height: ${handleSize(props.height ?? '300px')};
`)

const svgRef = ref(null)
const contentRef = ref<HTMLDivElement>()

onMounted(async () => {
  const transformer = new Transformer()
  const loadSource = contentRef.value?.querySelector('pre')?.innerText || ''
  const { root } = transformer.transform(loadSource)
  svgRef.value && Markmap.create(svgRef.value, {
    color: () => 'var(--vp-c-brand-1)',
    spacingHorizontal: 24,
    spacingVertical: 10,
    zoom: false,
    pan: false,
    maxInitialScale: 1,
  }, root)
})
</script>

<style>
.markmap-container {
  overflow: auto;
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
}
</style>