<template>
  <div class="vp-codeview-container" ref="containerRef">
    <div class="vp-view-container">
      <slot />
    </div>
    <div class="vp-code-container">
      <div class="vp-codeview-inner">
        <slot name="code" />
      </div>
    </div>
    <div class="vp-codeview-expand" @click="handleToggle">
      <div class="vp-codeview-icon-down">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32"><path d="M512 666.922667l382.634667-202.538667-39.936-75.434667L512 570.368 169.301333 388.949333l-39.936 75.434667L512 666.88z"></path></svg>
      </div>
      <div class="vp-codeview-icon-up">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32"><path d="M512 357.077333l382.634667 202.538667-39.936 75.434667L512 453.632l-342.698667 181.418667-39.936-75.434667L512 357.12z"></path></svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  id: string
}

const props = defineProps<Props>()

const containerRef = ref<HTMLDivElement>()

const handleToggle = () => {
  containerRef.value?.classList.toggle('vp-codeview-actived')
}
</script>

<style scoped>
.vp-codeview-container {
  --vp-codeview-color: var(--vp-c-text-3);
  position: relative;
  width: var(--codeview-width, 100%);
  border: 1px dashed transparent;
  border-radius: var(--mermaid-border-radius, 8px);
}
.vp-code-container {
  margin-top: 8px;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s ease;
}
.vp-codeview-inner {
  overflow: hidden;
}
.vp-codeview-expand {
  position: relative;
  fill: var(--vp-codeview-color);
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.vp-codeview-container.vp-codeview-actived {
  border-color: var(--vp-code-color);
}
[class|=vp-codeview-icon] {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 14px;
  color: var(--vp-codeview-color);
}
.vp-codeview-container:hover {
  --vp-codeview-color: var(--vp-code-color);
}
.vp-codeview-icon-up,
.vp-codeview-actived .vp-codeview-icon-down {
  display: none;
}
.vp-codeview-actived .vp-codeview-icon-up {
  display: flex;
}

.vp-codeview-actived .vp-code-container {
  grid-template-rows: 1fr;
}
</style>
<style>
.vp-code-container div[class*='language-'] {
  margin: 0;
}
</style>