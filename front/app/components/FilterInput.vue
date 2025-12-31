<template>
  <div class="filter-button">
    <input
      v-model="modelValue"
      @input="updateModelValue"
      :placeholder="placeholder"
      class="filter-input"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  }
})

const modelValue = defineModel()

function updateModelValue(event) {
  modelValue.value = event.target.value
}
</script>

<style scoped>
.filter-button {
  display: flex;
  align-items: center;
  background-color: var(--accent-color);
  border-radius: 5px;
  padding: 5px;
}

.filter-input {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 3px;
  background-color: var(--primary-color);
  color: var(--accent-color);
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
}
</style>
