<template>
  <div class="background">
    <Panel :text="bigText"/>
    <Panel class="minipanel" :text="miniText"/>
    <Topbutton/>
  </div>
  <MessagePanel :messages="messages" @close="messages = []" />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Panel from '~/components/Panel.vue'
import Topbutton from '~/components/Topbutton.vue'
import { messages } from '~/assets/messages'
import { useFetch } from '#imports'

const route = useRoute()
const bigText = ref('')
const miniText = ref('')

const id = route.params.id

const { data: loanData, error: loanError } = useFetch(
  () => id ? `http://localhost:4000/api/loans/${id}` : null,
  { method: 'GET', headers: { 'Content-Type': 'application/json' } }
)

const { data: bookData, error: bookError } = useFetch(
  () =>
    loanData && loanData.value && loanData.value.book
      ? `http://localhost:4000/api/books/${loanData.value.book.id}`
      : null,
  { method: 'GET', headers: { 'Content-Type': 'application/json' } }
)

watch(loanData, (loan) => {
  if (!id) {
    messages.value.push('ID no proporcionado.')
    return
  }
  if (!loan) return
  // Si loan existe pero no tiene book, mostrar mensaje
  if (!loan.book || !loan.book.id) {
    messages.value.push('No se encontró información del préstamo o libro asociado.')
  }
})

watch(bookData, (response) => {
  if (!response) return

  miniText.value = response.book_name || 'Nombre no disponible'

  let info = 'Año escrito: ' + (response.year_written || 'No disponible') + ';'
  info += 'Copias disponibles: ' + (response.available_copies ?? 0) + ';'

  if (response.main_authors && response.main_authors.length > 0) {
    info +=
      'Autor/es: ' +
      response.main_authors.map((author) => author.author_name || 'No disponible').join(', ') +
      ';'
  } else {
    info += 'Autor/es: No disponible/s;'
  }

  if (response.key_words && response.key_words.length > 0) {
    info +=
      'Palabra/s clave/s: ' +
      response.key_words.map((kw) => kw.key_word_name || 'No disponible').join(', ') +
      ';'
  } else {
    info += 'Palabras/s: No disponible/s;'
  }

  bigText.value = info
  messages.value.push('Información del libro cargada correctamente')
})

watch([loanError, bookError], ([lErr, bErr]) => {
  const err = lErr?.value || bErr?.value
  if (err) messages.value.push('Error al cargar la información del libro: ' + (err.message || err))
})
</script>

<style scoped>
.background {
  background-color: #d9d9d9;
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
  background-color: #372f2f;
  border: 5px solid #93877e;
  color: #d9d9d9;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
  display: flex;
  transform: translateY(-350px);
  flex-direction: column;
}
</style>
