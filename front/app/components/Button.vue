<template>
  <div class="button">
    <button>
      Agregar Libro
    </button>
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
button {
  display: flex;
  align-items: center;
  background-color: var(--primary-color);
  border-radius: 5px;
  padding: 5px;
  font-family: 'Quicksand', sans-serif;
  height: 50px;
  width: 100px;
  font-size: small;
  border-color: var(--accent-color);
  cursor: pointer;
  border-width: 5px;
}
</style>
