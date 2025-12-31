<template>
<User :nav="navItems"/>
  <div class="background">
    <div class="images-row">
      <img v-for="(src, index) in imageSources" :key="index" :src="src" class="thumb" alt="imagen" />
    </div>
    <Panel />
  </div>
</template>

<script setup>
import User from '~/layouts/User.vue'
import Panel from '~/components/Panel.vue'
import { messages } from '~/assets/messages'
import { getDefaultNav } from '~/assets/getNav'

const navItems = getDefaultNav()

// Enlaces o rutas de las imágenes
const imageSources = [
  '/bib1.jpg',
  '/bib2.png',
  '/bib3.png',
  '/bib4.png'
]

onMounted(() => {
  messages.value.push("Bienvenido a esta nueva sección. Aquí puedes ver la información de la Biblioteca")
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

.images-row {
  display: flex;
  justify-content: center;      /* centra el conjunto horizontalmente si hay más espacio */
  gap: 20px;                      /* separación entre imágenes */
  padding: 8px 16px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 50px;
  margin-left: 25px;
}

.thumb {
  width: 240px;                    /* ancho de cada imagen (ajusta si lo necesitas) */
  height: 240px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
