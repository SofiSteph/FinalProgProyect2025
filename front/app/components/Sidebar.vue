<template>
  <aside :class="['sidebar', { 'sidebar-collapsed': collapsed }]" aria-label="Panel lateral">
    <div class="avatar-container">
      <img @click="toggle" src="/user.png" alt="Avatar" width="150" height="150" style="border-radius:50%; object-fit:cover;">
    </div>

    <!-- Contenido desplazable -->
    <div class="scrollable-area" aria-label="Contenido desplazable">

      <!-- Nombre de usuario -->
      <div class="section">
        <span>{{ userName }}</span>
      </div>

      <!-- Información del usuario -->
      <div class="section user-info-section">
        <p v-html="userInfo"></p>
      </div>

       <!-- Opciones de navegación pasadas por props (si existiesen) -->
      <template v-if="navOptions && navOptions.length">
        <template v-for="(opt, index) in navOptions" :key="index">
          <nav class="section change" :aria-label="opt.ariaLabel || `Opcion ${index + 1}`">
            <NuxtLink v-if="opt.to" :to="opt.to" exact>{{ opt.label }}</NuxtLink>
          </nav>
        </template>
      </template>

      <!-- Cerrar sesión -->
      <nav class="section change" aria-label="Cerrar sesion">
        <NuxtLink to="/" exact>Cerrar sesión</NuxtLink>
      </nav>
    </div>

    <!-- Área para navegación vertical adicional (teclado) -->
    <div class="vertical-scroll-hint" aria-hidden="true" />
  </aside>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { formatText } from '@/assets/formatText'

// Estado del sidebar
const collapsed = ref(false)

// Nueva capa de contracción más extrema
const extremeCollapsed = ref(false)

const userName = ref('')
const userInfo = ref('')

function toggle() {
  if (!collapsed.value) {
    collapsed.value = true
  } else {
    // Volver al estado original
    extremeCollapsed.value = false
    collapsed.value = false
  }
}

onMounted(async () => {
  if (!process.client) return
  const userId = parseInt(localStorage.getItem('userId'))
  if (userId) {
    try {
      const user = await $fetch(`http://localhost:4000/api/users/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      userName.value = user.username
      userInfo.value = formatText(`Nombre: ${user.name} ; Email: ${user.email}`)
    } catch (error) {
      console.error('Error fetching user info: ' + error.message)
    }
  }
})

const props = defineProps({
  navOptions: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap');

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
  min-width: 200px;
  background-color: var(--accent-color);
  border-right: 10px solid var(--secondary-color);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 12px;
  box-sizing: border-box;
  z-index: 3000;
  transition: width 0.25s ease;
  overflow: hidden;
}

.sidebar a {
  text-decoration: none;
  color: var(--accent-color);
  font-family: 'Quicksand', sans-serif;
}

.sidebar-collapsed {
  width: 4rem;
}

.scrollable-area {
  overflow: auto;
  flex: 1 1 auto;
  padding: 0 4px;
  min-height: 0;
}

.section {
  border: 3px solid var(--secondary-color);
  background-color: var(--primary-color);
  margin-bottom: 12px;
  padding: 12px;
  justify-content: center;
  text-align: center;
  font-family: 'Quicksand', sans-serif;
  box-sizing: border-box;
  text-decoration: none;
}

.change:hover {
  background-color: var(--secondary-color);
  color: var(--primary-color);
  cursor: pointer;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
}

.user-info-section {
  text-align: left;
  justify-content: flex-start;
}
</style>