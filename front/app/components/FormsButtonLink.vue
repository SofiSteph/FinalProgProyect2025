<template>
  <NuxtLink :to="to" class="bg-inputsBg text-inputsText button">
    {{ text }}
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  text: string
}>()
</script>

<style scoped>
.bg-inputsBg {
  border: 3px solid var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  box-sizing: border-box;
  width: 100%;
}
.text-inputsText {color: var(--accent-color); font-family: 'Quicksand', sans-serif; text-decoration: none;  text-align: center;}
.button {background-color: var(--accent-color); color: var(--primary-color); cursor: pointer; border: 3px solid var(--secondary-color); }
</style>
