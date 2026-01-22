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
  bottom: 0;
  height: 45vh;
  background-color: var(--accent-color);
  border: 5px solid var(--secondary-color);
  color: var(--primary-color);
  overflow-y: auto;          /* scroll vertical cuando el contenido exceda */
  overflow-x: hidden;        /* desactiva el scroll horizontal */
  padding: 1rem;
  display: flex;
  transform: translateY(-10px);
  flex-direction: column;
  /* Default for large screens */
  left: 300px;
  width: calc(100vw - 300px);
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

/* Tablet styles */
@media (max-width: 1024px) {
  .bottom-panel {
    left: 200px;
    width: calc(100vw - 200px);
    height: 40vh;
    padding: 0.75rem;
  }
  .panel-text {
    font-size: 1rem;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .bottom-panel {
    left: 0;
    width: 100vw;
    height: 35vh;
    padding: 0.5rem;
    border-width: 3px;
  }
  .panel-text {
    font-size: 0.875rem;
    line-height: 1.4;
  }
}

/* Small mobile styles */
@media (max-width: 480px) {
  .bottom-panel {
    height: 30vh;
    padding: 0.25rem;
  }
  .panel-text {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
  }
}
</style>
