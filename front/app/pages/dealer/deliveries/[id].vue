<template>
  <div class="background">
    <NuxtImg class="book-image" width="200" height="200" src="/book.png" alt="préstamo"/>
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
import { messages, push } from '~/assets/messages'

const route = useRoute()
const bigText = ref('')
const miniText = ref('')

const id = route.params.id
// Fetch de la entrega
const { data: deliveryData, error: deliveryError, pending: deliveryPending } = useFetch(
  () => id ? `http://localhost:4000/api/deliveries/${id}` : null,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // server: false
  }
)

// Obtener nombre de libro usando useFetch
const getBookName = async (bookId) => {
  if (!bookId) return ''
  try {
    const { data: bookData, error: bookError } = await useFetch(
      `http://localhost:4000/api/books/${bookId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
    if (bookError && bookError.value) {
      console.error('Error al cargar libro:', bookError.value)
      return ''
    }
    return bookData.value ? bookData.value.book_name : ''
  } catch (e) {
    console.error('Error al cargar libro:', e)
    return ''
  }
}

// Obtener lector usando useFetch
const getReaderById = async (readerId) => {
  if (!readerId) return null
  try {
    const { data: readerData, error: readerError } = await useFetch(
      `http://localhost:4000/api/users/${readerId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
    if (readerError && readerError.value) {
      console.error('Error al cargar lector:', readerError.value)
      return null
    }
    return readerData.value || null
  } catch (e) {
    console.error('Error al cargar lector:', e)
    return null
  }
}

// Procesar cuando llegue la entrega
watch(deliveryData, async (response) => {
  if (!response) return

  try {
    miniText.value = response.status || ''
    const separator = '------------------------------'

    // información del lector
    const firstLoan = Array.isArray(response.loans) && response.loans.length > 0 ? response.loans[0] : null
    const reader = firstLoan ? await getReaderById(firstLoan.reader_user_id) : null

    let info = separator + ';' + 'Lector de esta entrega: ' + ';'
    info += 'Usuario: ' + (reader?.username || 'No disponible') + ';'
    info += 'Email: ' + (reader?.email || 'No disponible') + ';'
    info += separator + ';;'

    // información de la entrega
    const loans = Array.isArray(response.loans) ? response.loans : []
    info += 'TOTAL DE PRÉSTAMOS: ' + loans.length + ';'

    // obtener nombres de libros en paralelo
    const bookNames = await Promise.all(loans.map(l => getBookName(l.book_id)))

    const loansInfo = loans.map((loan, idx) => {
      return 'Libro: ' + (bookNames[idx] || '') + ';' +
             'Fecha de inicio: ' + (loan.loan_start_date || '') + ';' +
             'Fecha de vencimiento: ' + (loan.loan_end_date || '')
    }).join(';;')

    bigText.value = info + loansInfo
  } catch (error) {
    push('Error al cargar la información de la entrega: ' + (error.message || error))
  }
})

// Manejo de errores del fetch principal
watch(deliveryError, (err) => {
  if (err && err.value) push('Error al cargar la entrega: ' + (err.value.message || err.value))
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
