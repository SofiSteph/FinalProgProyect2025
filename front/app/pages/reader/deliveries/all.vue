<template>
  <User :nav="navItems"/>
  <div class="background">
    <Table :elements="elements" :optionValues="optionValues"/>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Table from '~/components/Table.vue'
import User from '~/layouts/User.vue'
import { useUser } from '~/assets/useUser'
import { getDefaultNav } from '~/assets/getNav'
import { messages } from '~/assets/messages'

const { getUserId } = useUser()
messages.value.push("Bienvenido a la sección de Entregas. Aquí puedes ver su información de las entregas (Ver) o cancelar su envío (Cancelar)")

const navItems = getDefaultNav()
const elements = ref([])
const optionValues = ['Ver', 'Cancelar']

// Obtener userId
const userId = getUserId()

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
    messages.value.push('Usuario no autenticado')
    return
  }

  if (!deliveries) return

  if (Array.isArray(deliveries) && deliveries.length > 0) {
    elements.value = deliveries.map((delivery) => ({
      id: delivery.id,
      value: delivery.status
    }))
  } else {
    messages.value.push('No tienes entregas aún ¿Qué tal si pides algún libro (Obtener)?')
    elements.value = []
  }
})

// Manejo de errores
watch(deliveriesError, (err) => {
  if (err && err.value) messages.value.push('Error al cargar las entregas: ' + (err.value.message || err.value))
})

onMounted(() => {
  if (userId) refreshDeliveries()
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
  z-index: -1;
}
</style>
