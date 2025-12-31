<template>
  <div class="background">
    <NuxtImg class="book-image" width="200" height="200" src="/book.png" alt="entrega"/>
    <Panel :text="bigText"/>
    <Panel class="minipanel" :text="miniText"/>
    <Topbutton/>
  </div>
  <MessagePanel :messages="messages" @close="messages = []" />
</template>

<script setup>
import { ref} from 'vue'
import { useRoute } from 'vue-router'
import Panel from '~/components/Panel.vue'
import Topbutton from '~/components/Topbutton.vue'
import { messages } from '~/assets/messages'

const route = useRoute()
const bigText = ref('')
const miniText = ref('')

const id = route.params.id
const { data: deliveryData, error: deliveryError} = useFetch(
  () => id ? `http://localhost:4000/api/deliveries/${id}` : null,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // server: false
  }
)

const getBookName = async (bookId) => {
  try {
    const { data: bookData, error: bookError } = await useFetch(`http://localhost:4000/api/books/${bookId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // server: false
    })
    if (bookError && bookError.value) {
      console.error('Error al cargar libro:', bookError.value)
      return ''
    }
    return bookData.value ? bookData.value.book_name : ''
  } catch (e) {
    console.error(e)
    return ''
  }
}

watch(deliveryData, async (response) => {
  if (!response) return

  try {
    miniText.value = response.status || ''

    const separator = '------------------------------'
    let info = separator + ';' + 'Repartidor de esta entrega: ' + ';'
    info += 'Usuario: ' + (response.user?.username || 'No disponible') + ';'
    info += 'Email: ' + (response.user?.email || 'No disponible') + ';'
    info += separator + ';;'
    info += 'TOTAL DE PRÉSTAMOS: ' + (Array.isArray(response.loans) ? response.loans.length : 0) + ';'

    // obtener nombres de libros en paralelo
    const loans = Array.isArray(response.loans) ? response.loans : []
    const bookNames = await Promise.all(loans.map(l => getBookName(l.book_id)))

    const loansInfo = loans.map((loan, idx) => {
      return 'Libro: ' + (bookNames[idx] || '') + ';' +
             'Fecha de inicio: ' + (loan.loan_start_date || '') + ';' +
             'Fecha de vencimiento: ' + (loan.loan_end_date || '')
    }).join(';;')

    bigText.value = info + loansInfo
    messages.value.push('Información de la entrega cargada correctamente')
  } catch (error) {
    messages.value.push('Error al procesar la entrega: ' + (error.message || error))
  }
})

// Manejo de errores del fetch principal
watch(deliveryError, (err) => {
  if (err && err.value) messages.value.push('Error al cargar la entrega: ' + (err.value.message || err.value))
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
