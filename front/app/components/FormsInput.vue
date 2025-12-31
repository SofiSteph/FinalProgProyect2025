<template>
  <input
    :id="id"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="updateValue"
    class="bg-inputsBg text-inputsText"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  id: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped>
.bg-inputsBg {
  background-color: var(--accent-color);
  width: 700px;
  height: 40px;
  border: 3px solid var(--secondary-color);
  margin-bottom: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  box-sizing: border-box;
}
.text-inputsText {
  color: var(--primary-color);
  font-family: 'Quicksand', sans-serif;
  text-decoration: none;
  text-align: center;
}
</style>