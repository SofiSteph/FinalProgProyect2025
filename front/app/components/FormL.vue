<template>
  <section class="min-h-screen flex items-center justify-center bg-black/5 p-6 section">
    <div class="avatar-container">
      <img src="/user.png" alt="Avatar" width="150" height="150" style="border-radius:50%; object-fit:cover;">
    </div>

    <form class="w-full max-w-md bg-white/5 p-6 rounded-md space-y-8 form" @submit.prevent="handleSubmit">
      <!-- Nombre de usuario -->
      <div class="mb-6">
        <FormsInput id="usuario" v-model="form.usuario" type="text" placeholder="Usuario" />
      </div>

        <!-- Contraseña -->
      <div class="mb-6">
        <FormsInput id="contraseña" v-model="form.contraseña" type="password" placeholder="Contraseña" />
      </div>

      <div class="buttons-nav">
        <!-- Registrarse -->
        <NuxtLink to="/" class="bg-inputsBg changecolor text-inputsText button" >
          Registrarse
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { messages } from '~/assets/messages'
import { watch, onMounted } from 'vue'

const router = useRouter()

const form = reactive({
  usuario: '',
  contraseña: ''
})

//clave única del localStorage
const STORAGE_KEY = "localMemory"

function validate() {
  let ok = true
  if (!form.usuario) {  messages.value.push('Su usuario es requerido') ; ok = false } 
  if (!form.contraseña) {   messages.value.push('Su contraseña es incorrecta') ; ok = false } 
  return ok
}

async function handleSubmit() {
  if (!validate()) return

  try {
    const user = await $fetch(`http://localhost:4000/api/users/username/${form.usuario}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (user.password !== form.contraseña) {
      messages.value.push('Contraseña incorrecta')
      return
    }

    localStorage.setItem('userId', user.id);

    const roleData = await $fetch(`http://localhost:4000/api/roles/${user.role_id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const role = roleData.role;

    switch (role) {
      case 'reader':
        router.push('/reader/books/all')
        messages.value.push("Bienvenido a la sala de libros. Aquí puedes ver su información (Ver) y obtenerlos por medio de préstamos (Obtener) en caso de que lo desees")
        break
      case 'technician':
        router.push('/technician/loans/all')
        messages.value.push("Bienvenido a la sección de Préstamos Solicitados por los Usuarios. Valídalos (Validar) o no (Invalidar), según convenga. También puedes obtener información de estos (Info)")
        break
      case 'dealer':
        router.push('/dealer/deliveries/all')
        messages.value.push("Bienvenido a la sala de Entregas. Aquí puedes cambiar sus estados")
        break
      default:
        messages.value = ['Rol no reconocido']
        break
    }
  } catch (error) {
    messages.value = ['Error: '+ error]
  }
}

onMounted(() => {
  const savedData = localStorage.getItem(STORAGE_KEY)
  if(savedData){
    Object.assign(form, JSON.parse(savedData));
  }
});

watch(form, (newData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
});
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