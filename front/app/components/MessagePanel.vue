<template>
  <div v-if="messages && messages.length > 0" class="message-panel" :style="{ left: panelPosition.x + 'px', top: panelPosition.y + 'px' }" @mousedown="startDrag">
    <div class="panel-header">
      <button class="close-btn" @click="$emit('close')">X</button>
    </div>
    <div v-for="(message, index) in messages" :key="index" class="message">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

interface Props {
  messages: string[]
}

defineProps<Props>()
defineEmits<{
  close: []
}>()

const panelPosition = reactive({ x: 10, y: 0 })

onMounted(() => {
  panelPosition.y = window.innerHeight - 200
})
const isDragging = ref(false)
const dragOffset = reactive({ x: 0, y: 0 })

function startDrag(event: MouseEvent) {
  isDragging.value = true
  dragOffset.x = event.clientX - panelPosition.x
  dragOffset.y = event.clientY - panelPosition.y
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

function drag(event: MouseEvent) {
  if (isDragging.value) {
    panelPosition.x = event.clientX - dragOffset.x
    panelPosition.y = event.clientY - dragOffset.y
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped>
.message-panel {
  position: fixed;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  max-width: 300px;
  z-index: 10000;
  cursor: move;
  user-select: none;
}

.panel-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
}

.close-btn:hover {
  color: #ccc;
}

.message {
  margin-bottom: 5px;
  font-size: 14px;
}
</style>
