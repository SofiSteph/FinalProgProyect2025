<template>
  <div class="background">
  <Header />
  <section class="section">
    <div class="avatar-container">
      <img :src="imageUrl"  alt="Libro" width="150" height="150" style="border-radius:50%; object-fit:cover;" @error="handleImageError">
    </div>
    
    <FormBook @submit="handleSubmit" :initialForm="form" :visibleImage="false">
      <template #buttons>
        <FormsButtonLink to="/technician/books/all" text="Volver"/>
        <FormsButtonSubmit />
      </template>
    </FormBook>
  </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch} from 'vue'
import { navigateTo } from '#app'
import { messages } from '~/assets/messages'
import FormsButtonSubmit from '~/components/FormsButtonSubmit.vue'
import FormsButtonLink from '~/components/FormsButtonLink.vue'
import { useRoute } from 'vue-router'
import Header from '~/components/Header.vue'
import FormBook from '~/components/FormBook.vue'
import { push } from '~/assets/messages'
import { forms } from 'happy-dom/lib/PropertySymbol'

const route = useRoute()
const bookId = route.params.id
const config = useRuntimeConfig()

useSeoMeta({
  title: 'Edición de Libro',
  description: 'Editar un libro'
})

const STORAGE_KEY = "localMemory"

let title = ref("")
let authors = ref([{ name: '', country: '' }])
let keywords = ref('')
let copies= ref("")
let imageUrl = ref("")
let year = ref("")

const form = {
  title,
  authors,
  keywords,
  copies,
  image: imageUrl,
  year
}

const { data: bookData, error: bookError, pending: deliveryPending } = useFetch(
  () => `${config.public.backend_url}/api/books/${bookId}`,
  {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    server: false
  }
)

onMounted(async () => {
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

watch(bookData, async (response: any) => {
  if (!response) return

   try {
    title.value = response.book_name
    year.value = response.year_written
    copies.value = response.available_copies
    authors.value = response.main_authors && response.main_authors.length > 0 ? response.main_authors.map((author: any) => ({ name: author.author_name, country: author.country_of_origin })) : [{ name: '', country: '' }]
    keywords.value = response.key_words && response.key_words.length > 0 ? response.key_words.map(keyword => keyword.key_word_name ).join(', ') : ''
    imageUrl.value = `${config.public.backend_url}/${response.image}`
    imageUrl.value = imageUrl.value.replace('/public/', '/');
    push(imageUrl.value)
  } catch (error: any) {
    push('Error al cargar la información del libro: ' + error.message)
  }
})

function validate() {
  let ok = true
  if (!form.authors || form.authors.length === 0 || !form.authors[0] || !form.authors[0].name) {messages.value.push("El autor principal es requerido") ; ok = false }
  if (!form.copies) {messages.value.push("Las copias son requeridas") ; ok = false }
  if (!form.image) {messages.value.push("La imagen es requerida") ; ok = false }
  if (!form.keywords) {messages.value.push("Las palabras clave son requeridas") ; ok = false }
  if (!form.title) {messages.value.push("El título es reuqerido") ; ok = false }
  if (!form.year) {messages.value.push("El año es requerido") ; ok = false }
  return ok
}

async function handleSubmit() {
  if (!validate()) return;
  try {
    // Recorrer la lista de autores introducidos
    for (const author of form.authors) {
      if (!author.name) continue; // Saltar autores vacíos

      // Verificar si el autor existe en la base de datos
      let existingAuthor = await $fetch(`${config.public.backend_url}/api/main_authors/by-name/${encodeURIComponent(author.name)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      let authorId;
      if (!existingAuthor) {
        // Si no existe, agregarlo usando createMainAuthor
        const newAuthor = await $fetch(`${config.public.backend_url}/api/main_authors/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author_name: author.name,
            country_of_origin: author.country
          })
        });
        authorId = newAuthor.data.id;
      } else {
        authorId = existingAuthor.id;
      }

      // Verificar si la asociación ya existe
      const authorBooks = await $fetch(`${config.public.backend_url}/api/main_authors/books/${authorId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const isAssociated = authorBooks.some((book: any) => book.id == bookId);

      if (!isAssociated) {
        // Asociar el autor al libro usando associateBookWithAuthor
        await $fetch(`${config.public.backend_url}/api/main_authors/associate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: bookId,
            mainAuthorId: authorId
          })
        });
      }
    }}catch(error: any){
      push("Error al agregar los autores:" + error)
    }
    
    try{
    const keywords = form.keywords.split(',').map(k => k.trim()).filter(k => k);
    // Recorrer la lista de palabras clave introducidas
    if(keywords.length>0){
    for (const keyword of keywords) {
      if (!keyword) continue; // Saltar palabras clave vacías

      // Verificar si la palabra clave existe en la base de datos
      let existingKeyword = await $fetch(`${config.public.backend_url}/api/key_words/name/${keyword}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      let keywordId;
      if (!existingKeyword) {
        // Si no existe, agregarla usando createKeyWord
        const newKeyword = await $fetch(`${config.public.backend_url}/api/key_words/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key_word_name: keyword
          })
        });
        keywordId = newKeyword.data.id;
      } else {
        keywordId = existingKeyword.id;
      }

      // Verificar si la asociación ya existe
      const keywordBooks = await $fetch(`${config.public.backend_url}/api/key_words/books/${keyword}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const isAssociated = keywordBooks.some((book: any) => book.id == bookId);

      if (!isAssociated) {
        // Asociar la palabra clave al libro usando associateBookWithKeyWord
        await $fetch(`${config.public.backend_url}/api/key_words/associate/${bookId}/${keywordId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }}
    } catch (error: any) {
    push('Error al actualizar las palabras clave: ' + error.message);
  }

    const updateData = {
      book_name: form.title,
      year_written: parseInt(form.year, 10),
      available_copies: parseInt(form.copies, 10),
      image: imageUrl.value,
    };
    
    try{
    // Enviar solicitud PUT al backend para actualizar el libro
    const response = await $fetch(`${config.public.backend_url}/api/books/update/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    // Limpiar localStorage después de la actualización exitosa
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY);
    }

    push("Libro actualizado exitosamente")
    await navigateTo('/technician/books/all');
  } catch (error: any) {
    push('Error al actualizar el libro: ' + error.message);
  }
}

watch(bookError, lErr => {
  const err = lErr
  if (err) push('Error al cargar la información del libro: ' + (err.message || err))
})

const handleImageError = () => {
  imageUrl.value = '/book.png'
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
.background {
  background-color: var(--primary-color);
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
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
