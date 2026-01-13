<template>
  <User :nav="navItems"/>
  <div class="background">
    <h1 class="title">... Entregas</h1>
    <Table :elements="elements" :optionValues="optionValues"/>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Table from '~/components/Table.vue'
import User from '~/layouts/User.vue'
import { getDefaultNav } from '~/assets/getNav'
import { messages, push } from '~/assets/messages'

push("Bienvenido a la sección de Entregas. Aquí puedes ver su información de las entregas (Ver) o cancelar su envío (Cancelar)")

const navItems = getDefaultNav()
const elements = ref([])
const optionValues = ['Ver', 'Cancelar']

// Obtener userId
const userId = parseInt(localStorage.getItem('userId'))

// useFetch condicionado: si userId es falsy no hace la petición
const { data: deliveriesData, error: deliveriesError, pending: deliveriesPending, refresh: refreshDeliveries } = useFetch(
  () => userId ? `http://localhost:4000/api/deliveries/user/${userId}` : null,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    // server: false // descomentar si quieres solo cliente
  }
)

// Procesar datos cuando lleguen
watch(deliveriesData, (deliveries) => {
  if (!userId) {
    push('Usuario no autenticado')
    return
  }

  if (!deliveries) return

  if (Array.isArray(deliveries) && deliveries.length > 0) {
    elements.value = deliveries.map((delivery) => ({
      id: delivery.id,
      value: delivery.status
    }))
  } else {
    push('No tienes entregas aún ¿Qué tal si pides algún libro (Obtener)?')
    elements.value = []
  }
})

// Manejo de errores
watch(deliveriesError, (err) => {
  if (err && err.value) push('Error al cargar las entregas: ' + (err.value.message || err.value))
})

onMounted(() => {
  if (userId) refreshDeliveries()
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
