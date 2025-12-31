<template>
  <section class="min-h-screen flex items-center justify-center bg-black/5 p-6 section">
    <div class="avatar-container">
      <img src="/user.png" alt="Avatar" width="150" height="150" style="border-radius:50%; object-fit:cover;">
    </div>

    <form class="w-full max-w-md bg-white/5 p-6 rounded-md space-y-8 form" @submit.prevent="handleSubmit">
      <!-- Nombre -->
      <div class="mb-6">
        <FormsInput id="nombre" v-model="form.nombre" type="text" placeholder="Nombre" />
      </div>

      <!-- Email -->
      <div class="mb-6">
        <FormsInput id="email" v-model="form.email" type="email" placeholder="Email" />
      </div>

      <!-- Nombre de usuario -->
      <div class="mb-6">
        <FormsInput id="usuario" v-model="form.usuario" type="text" placeholder="Usuario" />
      </div>

      <!-- Contraseña -->
      <div class="mb-6">
        <FormsInput id="contraseña" v-model="form.contraseña" type="text" placeholder="Contraseña" />
      </div>

      <!-- Rol -->
      <div class="mb-6">
        <select id="rol" v-model="form.rol" class="bg-inputsBg text-inputsText">
          <option value="" disabled>Rol</option>
          <option v-for="role in roles" :key="role.id" :value="role">{{ role.role }}</option>
        </select>
      </div>

      <!-- Sala (En caso de que sea técnico de sala) -->
      <div v-if="form.rol.role === 'technician'" class="mb-6">
        <select id="bookroom" v-model="form.bookroom" class="bg-inputsBg text-inputsText">
          <option value="" disabled>Sala a la que pertenece</option>
          <option v-for="sala in salas" :key="sala.id" :value="sala.id">{{ sala.room_name }}</option>
        </select>
      </div>

      <div class="buttons-nav">

        <!-- Iniciar sesión -->
        <NuxtLink to="/login" class="changecolor bg-inputsBg text-inputsText button" >
          Iniciar sesión
        </NuxtLink>
        
        <!-- Aceptar -->
        <button type="submit" class="change bg-inputsBg text-inputsText button">
          Aceptar
        </button>

      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch} from 'vue'
import { navigateTo } from '#app'
import { messages } from '~/assets/messages'

const theme = ref("light");
const STORAGE_KEY = "localMemory"

const form = reactive({
  nombre: '',
  contraseña: '',
  email: '',
  usuario: '',
  rol: '',
  bookroom: 0
})

const salas = ref<any[]>([])
const roles = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await $fetch('http://localhost:4000/api/book_rooms/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    salas.value = response
  } catch (error) {
    messages.value.push('Error al obtener las salas: ' + error)
  }

  try { 
    const response = await $fetch('http://localhost:4000/api/roles/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    roles.value = response
  } catch (error) {
    messages.value.push('Error al obtener los roles: ' + error)
  }

  const savedData = localStorage.getItem(STORAGE_KEY)
  if(savedData){
    Object.assign(form, JSON.parse(savedData));
  }
});

watch(form, (newData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
});

function validate() {
  let ok = true
  if (!form.nombre) {messages.value.push("Su nombre es requerido") ; ok = false }
  if (!form.contraseña) {messages.value.push("Su contraseña es requerida") ; ok = false }
  if (!form.email) {messages.value.push("Su email es requerido") ; ok = false }
  if (!form.usuario) {messages.value.push("Su nombre de usuario es requerido") ; ok = false }
  if (!form.rol.role) {messages.value.push("Su rol es requerido") ; ok = false }
  if (form.rol.role === 'technician' && !form.bookroom) {messages.value.push("La sala es requerida") ; ok = false }
  return ok
}

async function handleSubmit() {
  if (!validate()) return;

  try {
    let userData = null;
    if (form.rol.role === 'technician') {
      userData = {
        name: form.nombre,
        password: form.contraseña,
        email: form.email,
        username: form.usuario,
        role_id: form.rol.id,
        book_room_id: form.bookroom
      };
    }else{
      userData = {
      name: form.nombre,
      password: form.contraseña,
      email: form.email,
      username: form.usuario,
      role_id: form.rol.id,
    };
    }
    const response = await $fetch('http://localhost:4000/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
   
    localStorage.setItem('userId', response.data.id);
      
      if (form.rol.role === 'technician') {
        await navigateTo('/technician/loans/all');
        messages.value.push("Bienvenido a la sección de Préstamos Solicitados por los Usuarios. Valídalos (Validar) o no (Invalidar), según convenga. También puedes obtener información de estos (Info)")
      } else if (form.rol.role === 'reader') {
        await navigateTo('/reader/books/all');
        messages.value.push("Bienvenido a la sala de libros. Aquí puedes ver su información (Ver) y obtenerlos por medio de préstamos (Obtener) en caso de que lo desees")
      } else if (form.rol.role === 'dealer') {
        await navigateTo('/dealer/deliveries/all');
        messages.value.push("Bienvenido a la sala de Entregas. Aquí puedes cambiar sus estados")
      }
  } catch (error) {
    messages.value.push('Error al crear el usuario: ' + error);
  }
}
</script>

<style scoped>
.avatar-container {
  margin-left: 100px;
  margin-top: 150px;
  width: 60px;
}
.form {
  margin-left: 300px;
  transform: translateY(-160px);
}
.section{
   margin-left: 35px;
}
.view{
  z-index: 9000;
}
.bg-inputsBg {
  background-color: var(--accent-color);
  width: 700px;
  height: 40px;
  border: 3px solid var(--secondary-color);
  margin-bottom: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  box-sizing: border-box;
}
.text-inputsText {color: var(--primary-color); font-family: 'Quicksand', sans-serif; text-decoration: none;  text-align: center;}
.button { width: 300px; height: 40px; margin-left: 100px; background-color: var(--accent-color); color: var(--primary-color); cursor: pointer; border: 3px solid var(--secondary-color); }
.buttons-nav{
   transform: translateX(-100px);
   display:flex;
}
.changecolor{
   background-color: var(--primary-color);
   border: 3px solid var(--accent-color);
   color: var(--accent-color);
}
.change:hover {
   background-color: var(--primary-color);
   border: 3px solid var(--secondary-color);
   color: var(--accent-color);
}
</style>
