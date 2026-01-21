<template>
  <div class="vp-mermaid-container" ref="containerRef" :style="containerStyle"></div>
  <div style="display: none" ref="contentRef">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import mermaid, { MermaidConfig } from 'mermaid'

interface Props {
  id: string
}

const props = defineProps<Props>()

const containerRef = ref<HTMLDivElement>()
const contentRef = ref<HTMLDivElement>()

const containerStyle = reactive<any>({})

onMounted(async () => {
  const code = contentRef.value?.querySelector('pre')?.innerText
  if (containerRef.value && code) {
    const initConfig: MermaidConfig = {
      securityLevel: 'loose',
      startOnLoad: false,
    }
    // @ts-ignore
    let config = await import('virtual:global-config')
    if (config?.default) {
      const { config: globalMermaidConfig, ...globalComponentConfig } = config.default.globalConfig
      if (globalMermaidConfig) {
        Object.assign(initConfig, globalMermaidConfig)
      }

      const { config: _, ...componentConfig } = config.default[props.id] || {}

      Object.assign(containerStyle, globalComponentConfig?.containerStyle, componentConfig?.containerStyle)
    }

    mermaid.initialize(initConfig)
    const { svg } = await mermaid.render(props.id, code)
    containerRef.value.innerHTML = svg
  }
})
</script>

<style scoped>
.vp-mermaid-container {
  position: relative;
  width: var(--mermaid-width, 100%);
  height: var(--mermaid-height, auto);
  border-radius: var(--mermaid-border-radius, 8px);
  background-color: var(--mermaid-background, var(--vp-c-bg-alt));
}
</style>