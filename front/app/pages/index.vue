<template>
  <Header />
  <Bookmark />
  <div class="background">
    <FormR />
  </div>
</template>

<script setup>
import FormR from '~/components/FormR.vue'
import Header from '~/components/Header.vue';
import Bookmark from '~/components/Bookmark.vue';
</script>

<style scoped>
.background {
  background-color: #d9d9d9;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>
