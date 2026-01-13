<template>
  <User :nav="navItems"/>
  <div class="background">
    <h1 class="title">... Préstamos</h1>
    <Table :elements="elements" :optionValues="optionValues"/>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Table from '~/components/Table.vue'
import User from '~/layouts/User.vue'
import { getEmptyNav } from '~/assets/getNav'
import { messages, push } from '~/assets/messages'
import { useFetch } from '#imports'

const optionValues = ['Info', 'Validar', 'Invalidar']
const navItems = getEmptyNav()
const elements = ref([])

const userId = parseInt(localStorage.getItem('userId'))

const { data: loansData, error: loansError, refresh: refreshLoans } = useFetch(
  () => userId ? `http://localhost:4000/api/loans/technician/${userId}` : null,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // server: false // descomentar si solo quieres petición en cliente
  }
)

watch(loansData, (loans) => {
  if (!userId) {
    push('Usuario no autenticado')
    return
  }
  if (!loans) return

  if (Array.isArray(loans) && loans.length > 0) {
    elements.value = loans.map((loan) => ({ id: loan.id, value: loan.reader.name }))
    push('Se han realizado ' + loans.length + ' préstamos en tu sala')
  } else {
    elements.value = []
    push('No tienes entregas aún ¿Qué tal si pides algún libro (Obtener)?')
  }
})

watch(loansError, (err) => {
  if (err && err.value) push('Error al cargar las entregas: ' + (err.value.message || err.value))
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
.title {
   position: absolute;
   top:  10%;
   left: 75%;
   font-family: 'Quicksand', sans-serif;
   color: var(--accent-color);
   font-size: 2rem;
   z-index: 1;
}
</style>
