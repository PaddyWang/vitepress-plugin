<template>
  <div class="vp-codeview-container" ref="containerRef">
    <div class="vp-view-container" ref="viewRef">
      <slot />
    </div>
    <div class="vp-code-container">
      <div class="vp-codeview-inner" ref="codeRef">
        <slot name="code" />
      </div>
    </div>
    <div class="vp-codeview-expand">
      <div class="vp-codeview-icon-down" @click="handleToggle">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32"><path d="M512 666.922667l382.634667-202.538667-39.936-75.434667L512 570.368 169.301333 388.949333l-39.936 75.434667L512 666.88z"></path></svg>
        {{ props.text }}
      </div>
      <div class="vp-codeview-icon-up" @click="handleToggle">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32"><path d="M512 357.077333l382.634667 202.538667-39.936 75.434667L512 453.632l-342.698667 181.418667-39.936-75.434667L512 357.12z"></path></svg>
        {{ props.activeText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  text?: string
  activeText?: string
  active?: boolean
  shadow?: boolean

  id: string
  importLang?: 'vue' | 'html'
}

const props = defineProps<Props>()

const containerRef = ref<HTMLDivElement>()
const codeRef = ref<HTMLDivElement>()
const viewRef = ref<HTMLDivElement>()

const handleToggle = () => {
  containerRef.value?.classList.toggle('vp-codeview-actived')
}

onMounted(() => {
  props.active && containerRef.value?.classList.add('vp-codeview-actived')

  let html: string = ''
  if (props.importLang === 'html' || props.shadow) {
    html = codeRef.value?.querySelector('code')?.innerText || ''
  }
  if (html && viewRef.value) {
    const shadow = viewRef.value.attachShadow({ mode: 'open' })
    shadow.innerHTML = html
    // 处理脚本
    const scriptStr = html.match(/<script[^>]*>([\s\S]*?)<\/script>/)
    if (scriptStr) {
      const scriptEl = document.createElement('script')
      // @ts-ignore
      window.__SHADOW_ROOT__ = shadow
      scriptEl.textContent = `(function(document){
        ${scriptStr[1]}
      })(window.__SHADOW_ROOT__)`
      shadow.appendChild(scriptEl)
    }
  }
})
</script>

<style scoped>
.vp-codeview-container {
  --codeview-color: var(--vp-c-text-3);
  position: relative;
  width: var(--codeview-width, 100%);
  border: 1px dashed transparent;
  border-radius: var(--codeview-border-radius, 8px);
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
  fill: var(--codeview-color);
  display: flex;
  justify-content: center;
}
.vp-codeview-container.vp-codeview-actived {
  border-color: var(--vp-code-color);
  overflow: hidden;
}
[class|=vp-codeview-icon] {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 14px;
  color: var(--codeview-color);
  cursor: pointer;
}
[class|=vp-codeview-icon]:hover {
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
}
.vp-codeview-container:hover {
  --codeview-color: var(--vp-code-color);
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
  margin: 0 !important;
}
</style>