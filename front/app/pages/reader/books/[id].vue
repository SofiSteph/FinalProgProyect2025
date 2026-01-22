<template>
  <div class="background">
    <NuxtImg class="book-image" width="200" height="200" :src="imageUrl" alt="libro" @error="handleImageError"/>
    <Panel :text="bigText"/>
    <Panel class="minipanel" :text="miniText"/>
    <Topbutton/>
  </div>
  <MessagePanel :messages="messages" @close="messages = []" />
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Panel from '~/components/Panel.vue'
import Topbutton from '~/components/Topbutton.vue'
import { messages, push } from '~/assets/messages'

useSeoMeta({
  title: 'Libro seleccionado',
  description: 'Información detallada del libro seleccionado por el usuario lector'
})

const route = useRoute()
const bigText = ref('')
const miniText = ref('')
const imageUrl = ref('')

const id = route.params.id
const { data: bookData, error: bookError} = useFetch(
  () => id ? `http://localhost:4000/api/books/${id}` : null,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    server: false
  }
)

watch(bookData, async (response) => {
  if (!response) return

   try {
    miniText.value = response.book_name || 'Nombre no disponible'
    let info = 'Año escrito: ' + (response.year_written || 'No disponible') + ';'
    info += 'Copias disponibles: ' + (response.available_copies || 0) + ';'
    response.main_authors && response.main_authors.length > 0 ? info += 'Autor/es: ' + response.main_authors.map(author => author.author_name + " ( " + author.country_of_origin + ")").join(', ') + ';' : info += 'Autor/es: No disponible/s;'
    response.book_room ? info += 'Sala: ' + (response.book_room.room_name || 'No disponible') + ';' : info += 'Sala: No disponible;'
    response.key_words && response.key_words.length > 0 ? info += 'Palabra/s clave/s: ' + response.key_words.map(keyword => keyword.key_word_name || 'No disponible' ).join(', ') + ';' : info += 'Palabras/s: No disponible/s;'
    bigText.value = info;
    imageUrl.value = `http://localhost:4000/${response.image}`
    imageUrl.value = imageUrl.value.replace('/public/', '/');
  } catch (error) {
    push('Error al cargar la información del libro: ' + error.message)
  }
})

// Manejo de errores del fetch principal
watch(bookError, (err) => {
  if (err && err.value) push('Error al cargar el libro: ' + (err.value.message || err.value))
})

const handleImageError = () => {
  imageUrl.value = '/book.png'
}
</script>

<style scoped>
.background {
  background-color: var(--primary-color);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5000;
}
.minipanel{
  position: fixed;
  left: 37vw;
  bottom: 0;
  height: 3vh;
  width: 50vh;
  background-color: var(--accent-color);
  border: 5px solid var(--secondary-color);
  color: var(--primary-color);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  display: flex;
  transform: translateY(-350px);
  flex-direction: column;
}

.book-image {
  z-index: 80000;
  margin-left: 43%;
  margin-top: 1%;
}
</style>
