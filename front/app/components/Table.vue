<template>
  <div class="table-container">
    <table class="table">
      <tbody>
        <tr v-for="(elem, rIdx) in displayedElements" :key="elem.id" class="text-center">
          <!-- Columna de elemento (mostrando value) -->
          <td class="element-cell element-style px-4 py-6" style="text-align: center;">
            <div class="element-inner" :title="`Contenido: ${elem.value}`"> {{ elem.value }} </div>
          </td>

          <!-- Columnas de opciones (grupo de estilos Option) -->
          <td v-for="(optValue, oIdx) in optionValues" :key="oIdx"
              class="option-cell option-style px-4 py-6"
              @click="handleOptionClick(elem, optValue)">
            {{ optValue }}
          </td>
        </tr>
      </tbody>
    </table>
    <FilterButtons v-if="route.path === '/reader/books/all'" @filter-author="handleFilterAuthor" @filter-date="handleFilterDate" @filter-keyword="handleFilterKeyword" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUser } from '~/assets/useUser'
import { ref, computed } from 'vue'
const router = useRouter()
const route = useRoute()
const { getUserId } = useUser()
import { messages } from '~/assets/messages'
import FilterButtons from '~/components/FilterButtons.vue'

const props = defineProps({
  elements: {
    type: Array,
    default: () => [],
  },
  optionValues: {
    type: Array,
    default: () => [],
  },
})

const filterKeyword = ref('')
const filterAuthor = ref('')
const filterDate = ref('')

const displayedElements = computed(() => {
  let list = [...props.elements]
  if (filterKeyword.value) {
    list = list.filter(elem => {
      const lowerKeyword = filterKeyword.value.toLowerCase();
      return elem.key_words && elem.key_words.some(kw => kw.toLowerCase().includes(lowerKeyword));
    })
  }
  if (filterAuthor.value) {
    list = list.filter(elem => {
      if (Array.isArray(elem.authors)) {
        return elem.authors.some(author => author.toLowerCase().includes(filterAuthor.value.toLowerCase()))
      }
      return (elem.authors || '').toLowerCase().includes(filterAuthor.value.toLowerCase())
    })
  }
  if (filterDate.value) {
    list = list.filter(elem => elem.year_written && elem.year_written.toString().includes(filterDate.value))
  }
  return list
})

function handleFilterAuthor(author) {
  filterAuthor.value = author
}

function handleFilterDate(date) {
  filterDate.value = date
}

function handleFilterKeyword(keyword) {
  filterKeyword.value = keyword
}

async function handleOptionClick(elem, optValue) {
    const userId = getUserId()
    if (!userId) {
        messages.value.push('Usuario no autenticado')
        return
    } 
    if (optValue === 'Ver'  && route.path === '/reader/books/all') {
        router.push({ path: `/reader/books/${elem.id}`})
    } else if (optValue === 'Obtener') {
        try{
             // Obtener información del libro para book_room_id
            const bookResponse = await  $fetch(`http://localhost:4000/api/books/${elem.id}`)
            const bookRoomId = bookResponse.book_room_id
            if (bookResponse.available_copies === 0) {
                messages.value.push('Ya no hay copias disponibles de este libro, por lo que no se puede ejecutar el préstamo')
                return
            }

            // Obtener técnicos de la sala
            const techniciansResponse = await  $fetch(`http://localhost:4000/api/book_rooms/technicians/${bookRoomId}`)
            if (techniciansResponse.length === 0) {
                messages.value.push('No hay técnicos disponibles para esta sala, por lo que el préstamo no se puede ejecutar el préstamo')
                return
            }
            const randomTechnician = techniciansResponse[Math.floor(Math.random() * techniciansResponse.length)]
            const roomTechnicianUserId = randomTechnician.id

            // Fechas para el préstamo
            const loanStartDate = new Date().toISOString().split('T')[0]
            const loanEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

            // Crear el préstamo
            const loanResponse = await $fetch(`http://localhost:4000/api/books/loan/${elem.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    loan_start_date: loanStartDate,
                    loan_end_date: loanEndDate,
                    reader_user_id: userId,
                    room_technician_user_id: roomTechnicianUserId,
                    delivery_id: null,
                    validated: false
                })
            })
            messages.value.push('Préstamo creado exitosamente')
        } catch (error) {
            console.error(error)
            messages.value.push('Error al procesar el préstamo: ' + error.message)
        }
    } else if (optValue === 'Cancelar') {
        try {
            const userId = getUserId()
            if (!userId) {
                messages.value.push('Usuario no autenticado')
                return
            }

            // Eliminar entrega
            await $fetch(`http://localhost:4000/api/deliveries/delete/${elem.id}`, { method: 'DELETE' })
            messages.value.push('Entrega cancelada exitosamente')
        } catch (error) {
            console.error(error)
            messages.value.push('Error al cancelar la entrega: ' + error.message)
        }
    } else if (optValue === 'Ver'  && route.path === '/reader/deliveries/all') {
       router.push({ path: `/reader/deliveries/${elem.id}`})
    }  else if (optValue === 'Validar') {
        try{
            // Validar el préstamo seleccionado
            await  $fetch(`http://localhost:4000/api/loans/validate/${elem.id}`, { method: 'PUT' })
            
            // Obtener el préstamo seleccionado
            const loanResponse = await  $fetch(`http://localhost:4000/api/loans/${elem.id}`)

            // Obtener delivery_id en caso de ser disponible
            const deliveryResponse = await  $fetch(`http://localhost:4000/api/deliveries/add-loan/${loanResponse.reader.id}`, { method: 'POST' })
            const deliveryId = deliveryResponse.deliveryId
             
            //añadir el préstamo a una entrega 
            await $fetch(`http://localhost:4000/api/loans/update/${elem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    delivery_id: deliveryId,
                    loan_start_date: loanResponse.loan_start_date,
                    loan_end_date: loanResponse.loan_end_date,
                    reader_user_id: loanResponse.reader_user_id,
                    room_technician_user_id: loanResponse.room_technician_user_id,
                    book_id: loanResponse.book_id
                })
            });

            messages.value.push('Préstamo validado exitosamente')
        } catch (error) {
            console.error(error)
            messages.value.push('No hay Repartidores de entregas disponibles en estos momentos, por lo que la validación no se puede ejecutar ')
        }
    }  else if (optValue === 'Invalidar') {
        try{
        // Invalidar el préstamo seleccionado
           await $fetch(`http://localhost:4000/api/loans/delete/${elem.id}`, { method: 'DELETE' })

            messages.value.push('Préstamo no validado exitosamente')
        } catch (error) {
            console.error(error)
            messages.value.push('Error al invalidar el préstamo: ' + error.message)
        }
    }  else if (optValue === 'Info'  && route.path === '/technician/loans/all') {
            router.push({ path: `/technician/loans/${elem.id}`})
    } else if (optValue === 'Cambiar') {
        try {
            const statuses = ['pendiente', 'en camino', 'entregado'];
            const currentIndex = statuses.indexOf(elem.value);
            const nextIndex = (currentIndex + 1) % statuses.length;
            const newStatus = statuses[nextIndex];

            await $fetch(`http://localhost:4000/api/deliveries/update/${elem.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: newStatus,
                    dealer_user_id: userId
                })
            });

            elem.value = newStatus;
            messages.value.push('Estado de entrega actualizado exitosamente');
        } catch (error) {
            console.error(error);
            messages.value.push('Error al actualizar el estado: ' + error.message);
        }
    }  else if (optValue === 'Info' && route.path === '/dealer/deliveries/all') {
            router.push({ path: `/dealer/deliveries/${elem.id}`})
    }
}
</script>

<style scoped>
/* Estilos para la columna de elementos (grupo Element) */
.element-cell {
  background-color: #372f2f;
  color: #d9d9d9;
  font-family: 'Quicksand', sans-serif;
  border-radius: 0;
}
.element-style {
  width: 720px; 
  height: 40px;
  padding: 0;           /* para que el inner tenga control del overflow */
  align-items: center;
  justify-content: left;
}
.element-inner {
  white-space: nowrap;    /* evita que el texto haga wrapping dentro de la celda */
  overflow-x: auto;         /* scroll horizontal si el texto excede el ancho */
  overflow-y: hidden;
  padding: 0 6px;       
}

/* Estilos para las celdas de opciones (grupo Option) */
.option-cell {
  background-color: #372f2f;
  color: #d9d9d9;
  font-family: 'Quicksand', sans-serif;
  border-radius: 0;
}
.option-style {
  width: 80px;
  height: 40px;
  text-align: center;
  cursor: pointer;
}
.option-cell:hover {
  background-color: #93877e; /* color de fondo temporal  */
  color: #d9d9d9;            /* color de fuente temporal  */
}

.table-container {
  overflow: auto;   /* añade scroll tanto vertical como horizontal si es necesario */
  border: 1px solid rgba(0,0,0,.1);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  max-width: 1035px;
  height: 580px;
  margin: 0 auto;
  margin-left: 185px;
  margin-top: 55px;
}

/* Estilos para la tabla */
.table {
  justify-content: center;
  border-spacing: 12px;
  margin-top: 80px;
}
</style>