<template>
  <select :id="id" v-model="value" class="select">
    <option value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="valueKey ? option[valueKey] : option" :value="valueKey ? option[valueKey] : option">
      {{ option[textKey] }}
    </option>
  </select>
</template>


<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  id: string;
  modelValue: any;
  options: any[];
  valueKey?: string;
  textKey: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});
</script>

<style scoped>
.select {
  background-color: var(--accent-color);
  border: 3px solid var(--secondary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  width: 100%;
  box-sizing: border-box;
  color: var(--primary-color);
  font-family: 'Quicksand', sans-serif;
  text-decoration: none;
  text-align: center;
}
</style>
