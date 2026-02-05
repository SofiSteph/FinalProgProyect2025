<template>
  <section class="section">
    <div class="avatar-container">
      <img src="/user.png" alt="Avatar" width="150" height="150" style="border-radius:50%; object-fit:cover;">
    </div>
    
    <div class="form">
    <form @submit.prevent="handleSubmit">
      <!-- Nombre -->
      <div class="mb-6 buttons">
         <FormsInput id="nombre" v-model="form.nombre" type="text" placeholder="Nombre" />
      </div>

      <!-- Email -->
      <div class="mb-6 buttons">
         <FormsInput id="email" v-model="form.email" type="email" placeholder="Email" />
      </div>

      <!-- Nombre de usuario -->
      <div class="mb-6 buttons">
        <FormsInput id="usuario" v-model="form.usuario" type="text" placeholder="Usuario" />
      </div>

      <!-- Contraseña -->
      <div class="mb-6 buttons">
        <FormsInput id="contraseña" v-model="form.contraseña" type="text" placeholder="Contraseña" />
      </div>

      <!-- Rol -->
      <div class="mb-6 buttons">
        <FormsList
          id="rol"
          v-model="form.rol"
          :options="roles"
          textKey="role"
          placeholder="Rol"
        />
      </div>

      <!-- Sala (En caso de que sea técnico de sala) -->
      <div v-if="form.rol.role === 'technician'">
        <FormsList
          id="bookroom"
          v-model="form.bookroom"
          :options="salas"
          valueKey="id"
          textKey="room_name"
          placeholder="Sala a la que pertenece"
        />
      </div>

      <div class="buttons buttons-row">
        <!-- Iniciar sesión -->
        <FormsButtonLink to="/login" text="Iniciar sesión" />
        <!-- Aceptar -->
        <FormsButtonSubmit />
      </div>
    </form>
  </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch} from 'vue'
import { navigateTo } from '#app'
import { messages } from '~/assets/messages'
import FormsButtonSubmit from './FormsButtonSubmit.vue'
import FormsList from './FormsList.vue'

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

  if (process.client) {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if(savedData){
      Object.assign(form, JSON.parse(savedData));
    }
  }
});

watch(form, (newData) => {
  if (process.client) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
  }
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
      } else if (form.rol.role === 'reader') {
        await navigateTo('/reader/books/all');
      } else if (form.rol.role === 'dealer') {
        await navigateTo('/dealer/deliveries/all');
      }
  } catch (error) {
    messages.value.push('Error al crear el usuario: ' + error);
  }
}
</script>

<style scoped>
.avatar-container {
  flex: 0 0 20%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.section {
  display: flex;
  margin-top: 9%;
  margin-left: 10%;
  height: 80%;
  width: 70%;
  align-items: flex-start;
}
.form {
  flex: 1;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}
.buttons {
  display: flex;
  width: 100%;
  margin-top: 12px;
  margin-bottom: 12px;
}
.buttons-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .section {
    flex-direction: column;
    align-items: center;
    margin-top: 5%;
    margin-left: 5%;
    width: 90%;
    height: auto;
  }
  .avatar-container {
    flex: none;
    height: 120px;
    margin-bottom: 20px;
  }
  .form {
    width: 100%;
    margin-left: 0;
  }
  .buttons-row {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .section {
    margin-top: 2%;
    margin-left: 2%;
    width: 96%;
  }
  .avatar-container {
    height: 100px;
  }
  .avatar-container img {
    width: 100px;
    height: 100px;
  }
  .buttons-row {
    gap: 20px;
  }
}
</style>
