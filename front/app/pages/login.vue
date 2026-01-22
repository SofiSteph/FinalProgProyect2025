<template>
  <Header />
  <Bookmark />
  <div class="background">
    <FormL />
  </div>
</template>

<script setup>
import FormL from '~/components/FormL.vue'
import Header from '~/components/Header.vue';
import Bookmark from '~/components/Bookmark.vue';

useSeoMeta({
  title: 'Inicio de sesión',
  description: 'Vista que utilizará el usuario para iniciar sesión en el sistema de biblioteca. Inicia sesión fácilmente y accede a tus libros y préstamos.',
  keywords: 'inicio de sesión, login, biblioteca, libros, préstamos, usuario',
  author: 'Biblioteca Team',
  robots: 'index, follow',
  canonicalUrl: 'http://localhost:3000/login',
  ogTitle: 'Inicio de sesión',
  ogDescription: 'Inicia sesión en el sistema de biblioteca para acceder a libros y préstamos.',
  ogImage: '/book.png',
  ogUrl: 'http://localhost:3000/login',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Inicio de sesión',
  twitterDescription: 'Inicia sesión en el sistema de biblioteca para acceder a libros y préstamos.',
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
