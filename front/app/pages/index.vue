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

useSeoMeta({
  title: 'Registro',
  description: 'Vista que utilizará el usuario para registrarse en el sistema de biblioteca. Regístrate fácilmente y accede a nuestros servicios.',
  keywords: 'registro, biblioteca, libros, préstamos, usuario',
  author: 'Biblioteca Team',
  robots: 'index, follow',
  canonicalUrl: 'http://localhost:3000/',
  ogTitle: 'Registro',
  ogDescription: 'Regístrate en el sistema de biblioteca para acceder a libros y préstamos.',
  ogImage: '/book.png',
  ogUrl: 'http://localhost:3000/',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Registro',
  twitterDescription: 'Regístrate en el sistema de biblioteca para acceder a libros y préstamos.',
  twitterImage: '/book.png'
})
</script>

<style scoped>
.background {
  background-color: var(--primary-color);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>
