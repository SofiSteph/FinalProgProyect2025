<template>
  <User :nav="navItems"/>
  <div class="background">
    <Table :elements="elements" :optionValues="optionValues"/>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import Table from '~/components/Table.vue'
import User from '~/layouts/User.vue'
import { getEmptyNav } from '~/assets/getNav'
const navItems = getEmptyNav()

const elements = ref([])
const optionValues = ['Cambiar', 'Info']

const { data: deliveriesData, error: deliveriesError, pending: deliveriesPending, refresh: refreshDeliveries } = useFetch('http://localhost:4000/api/deliveries', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  // server: false // descomenta si quieres ejecución solo en cliente
})

watch(deliveriesData, (deliveries) => {
  if (!deliveries) return
  if (Array.isArray(deliveries) && deliveries.length > 0) {
    elements.value = deliveries.map((delivery) => ({
      id: delivery.id,
      value: delivery.status
    }))
  } else {
    elements.value = []
  }
})

watch(deliveriesError, (err) => {
  if (err) console.error('Error al cargar las entregas:', err)
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
