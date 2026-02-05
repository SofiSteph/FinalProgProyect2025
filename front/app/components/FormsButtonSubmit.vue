<template>
  <button type="submit" class="change bg-inputsBg text-inputsText button">
    Aceptar
  </button>
</template>

<script setup lang="ts">
</script>

<style scoped>
.button {
  background-color: var(--accent-color);
  color: var(--primary-color);
  cursor: pointer;
  min-height: 48px;
  border: 3px solid var(--secondary-color);
  width: 100%;
}

.change:hover {
  background-color: var(--primary-color);
  border: 3px solid var(--secondary-color);
  color: var(--accent-color);
}
</style>
