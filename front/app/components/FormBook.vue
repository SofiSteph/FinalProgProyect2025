<template>
  <div class="form">
    <form @submit.prevent="handleSubmit">
      <div class="mb-6 buttons">
        <FormsInput id="titulo" v-model="form.title" type="text" placeholder="Título" />
      </div>

      <div class="mb-6">
        <div v-for="(author, index) in form.authors" :key="index" class="author-row">
          <FormsInput :id="'autor-' + index" v-model="author.name" type="text" placeholder="Nombre del Autor" />
          <FormsInput :id="'pais-' + index" v-model="author.country" type="text" placeholder="País" />
          <button type="button" @click="removeAuthor(index)" class="remove-btn">Eliminar</button>
        </div>
        <button type="button" @click="addAuthor" class="add-btn">Agregar Autor +</button>
      </div>

      <div class="mb-6 buttons">
        <FormsInput id="palabras" v-model="form.keywords" type="text" placeholder="Palabras Clave (Separadas por coma)" />
      </div>

      <div class="mb-6 buttons">
        <FormsInput id="anyo" v-model="form.year" type="text" placeholder="Año en que fue escrito" />
      </div>

      <div class="mb-6 buttons">
        <FormsInput id="copias" v-model="form.copies" type="number" placeholder="Copias disponibles" />
      </div>

      <div class="mb-6 buttons">
        <FormsInput id="image" type="file" placeholder="Imagen" @change="handleImageChange" />
      </div>

      <div class="buttons buttons-row">
        <slot name="buttons"></slot>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue'
import FormsInput from './FormsInput.vue';

const props = defineProps<{
  initialForm?: Record<string, any>
  storageKey?: string
}>()

const emit = defineEmits<{
  submit: [form: Record<string, any>]
}>()

const form = reactive({
  title: '',
  authors: [{ name: '', country: '' }],
  keywords: '',
  copies: '',
  image: null as File | null,
  year: ''
})

onMounted(() => {
  if (props.initialForm) {
    Object.assign(form, props.initialForm)
  }
  if (props.storageKey && process.client) {
    const saved = localStorage.getItem(props.storageKey)
    if (saved) {
      Object.assign(form, JSON.parse(saved))
    }
  }
})

watch(form, (newData) => {
  if (props.storageKey && process.client) {
    localStorage.setItem(props.storageKey, JSON.stringify(newData))
  }
})

function validate() {
  let ok = true
  if (!form.authors.length || form.authors.some(author => !author.name || !author.country)) { ok = false }
  if (!form.copies) { ok = false }
  if (!form.image) { ok = false }
  if (!form.keywords) { ok = false }
  if (!form.title) { ok = false }
  if (!form.year) { ok = false }
  return ok
}

function addAuthor() {
  if (form.authors.length >= 3) return
  const lastAuthor = form.authors[form.authors.length - 1]
  if (!lastAuthor.name.trim() || !lastAuthor.country.trim()) return
  form.authors.push({ name: '', country: '' })
}

function removeAuthor(index: number) {
  if (form.authors.length > 1) {
    form.authors.splice(index, 1)
  }
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement
  form.image = target.files ? target.files[0] : null
}

function handleSubmit() {
  if (validate()) {
    emit('submit', { ...form })
  }
}


</script>

<style scoped>
.form {
  flex: 1;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
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
.author-row {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
}
.remove-btn {
  background-color: var(--accent-color);
  color: var(--primary-color);
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.add-btn {
  background-color: var(--primary-color);
  color: var(--accent-color) ;
  border-color: (--accent-color);
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
@media (max-width: 768px) {
  .buttons-row {
    flex-direction: column;
    gap: 15px;
  }
  .author-row {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
