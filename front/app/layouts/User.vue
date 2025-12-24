<template>
  <div>
    <Header />
    <Sidebar :navOptions="nav"/>
    <Bookmark />
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
import Sidebar from '~/components/Sidebar.vue'
import Bookmark from '~/components/Bookmark.vue'

defineProps({
  nav: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.main-content {
  margin-left: 25vw; /* Ajustar según el ancho del sidebar */
  margin-top: 50px;  /* Ajustar según la altura del header */
  padding: 20px;
}
</style>