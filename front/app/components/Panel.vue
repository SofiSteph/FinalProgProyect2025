<template>
  <div class="bottom-panel" aria-label="Panel inferior">
    <p v-if="text" class="panel-text" v-html="formattedText"></p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatText } from '@/assets/formatText'

const props = defineProps({
 text: String
})

const formattedText = computed(() => formatText(props.text))
</script>

<style scoped>
.bottom-panel {
  position: fixed;
  left: 198px;
  bottom: 0;
  height: 45vh;
  width: 151vh;
  background-color: var(--accent-color);
  border: 5px solid var(--secondary-color);
  color: var(--primary-color);
  overflow-y: auto;          /* scroll vertical cuando el contenido exceda */
  overflow-x: hidden;        /* desactiva el scroll horizontal */
  padding: 1rem;
  display: flex;
  transform: translateY(-10px);
  flex-direction: column;
}
.bottom-panel .content {
  width: 100%;
  word-wrap: break-word;
  hyphens: auto;
}
.panel-text {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  line-height: 1.6;
  font-family: 'Quicksand', system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
}
</style>