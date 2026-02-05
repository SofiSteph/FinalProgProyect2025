<template>
  <button @click="goBack" class="btn-top-right" aria-label="Volver">
    Volver
  </button>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push({ name: '/' })
  }
}
</script>

<style scoped>
.btn-top-right {
  font-weight: 700;
  border-radius: 0.5rem;
  background-color: var(--secondary-color);
  color: var(--primary-color) ;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: inline-block;
  position: absolute;
  cursor: pointer;
  top: 2rem;
  right: 2rem;
  width: auto;
  height: auto;
  font-family: 'Quicksand', system-ui, -apple-system, 'Segoe UI', Roboto, Arial;
  border-color: var(--accent-color);
  z-index: 100000;
}
</style>