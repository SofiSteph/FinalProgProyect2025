<template>
  <section class="section">
    <div class="avatar-container">
      <img src="/user.png" alt="Avatar" width="150" height="150" style="border-radius:50%; object-fit:cover;">
    </div>
    
    <div class="form">
      <form @submit.prevent="handleSubmit">
      <!-- Nombre de usuario -->
      <div class="mb-6 buttons">
        <FormsInput id="usuario" v-model="form.usuario" type="text" placeholder="Usuario" />
      </div>

      <!-- Contraseña -->
      <div class="mb-6 buttons">
        <FormsInput id="contraseña" v-model="form.contraseña" type="password" placeholder="Contraseña" />
      </div>

      <div class="buttons buttons-row">
        <!-- Registrarse -->
        <FormsButtonLink to="/" text="Registrarse"/>
        <!-- Aceptar -->
        <FormsButtonSubmit />
      </div>
    </form>
  </div>
</section>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { messages } from '~/assets/messages'
import { watch, onMounted } from 'vue'
import FormsButtonSubmit from './FormsButtonSubmit.vue'

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
        break
      case 'technician':
        router.push('/technician/loans/all')
        break
      case 'dealer':
        router.push('/dealer/deliveries/all')
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