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
import { getDealerNav} from '~/assets/getNav'
import { push } from '~/assets/messages'

useSeoMeta({
  title: 'Entregas',
  description: 'Vista de todas las entregas de libros que atenderá el usuario repartidor',
})
const navItems = getDealerNav()

const elements = ref([])
const optionValues = ['Cambiar', 'Info']

const { data: deliveriesData, error: deliveriesError, pending, refresh } = useFetch('http://localhost:4000/api/deliveries', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
  server: false
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

onMounted(async () => {
  push("Bienvenido a la sala de Entregas. Aquí puedes cambiar sus estados")
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

@media (max-width: 1000px) {
.title {
    display: none;
}
}
</style>
