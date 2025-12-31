<template>
  <header class="site-header">
  </header>
   <MessagePanel :messages="messages" @close="messages = []" />
</template>

<script setup>
import MessagePanel from './MessagePanel.vue'
import { messages } from '~/assets/messages'
</script>

<style scoped>
/* Quitar márgenes predeterminados del navegador */
:global(html, body) {
  margin: 0;
  padding: 0;
}

.site-header {
  position: fixed;      /* lo mantiene pegado a la parte superior de la ventana */
  top: 0;
  left: 0;
  width: 100%;            /* ocupa todo el ancho de la pantalla */
  height: 50px;
  background-color: var(--secondary-color);
  z-index: 2000;           /* por si hay contenido debajo */
}

</style>