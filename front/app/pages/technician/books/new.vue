<template>
  <div class="background">
  <Header />
  <section class="section">
    <div class="avatar-container">
      <img src="/book.png" alt="Avatar" width="150" height="150" style="border-radius:50%; object-fit:cover;">
    </div>
    
    <FormBook @submit="handleSubmit" :initialForm="form" :storageKey="STORAGE_KEY">
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

const route = useRoute()
const userId = route.query.userId
const config = useRuntimeConfig()

useSeoMeta({
  title: 'Libro nuevo',
  description: 'Agregar un libro'
})

const STORAGE_KEY = "localMemory"

const form = reactive({
  title: '',
  authors: [{ name: '', country: '' }],
  keywords: '',
  copies: '',
  image: null as File | null,
  year: ''
})

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

async function getRoomId() {
  try {
    const response = await $fetch(`${config.public.backend_url}/api/users/${userId}`) as any;
    return response?.book_room?.id;
  } catch (error) {
    messages.value.push('Error al obtener el ID de la sala: ' + error);
    return null;
  }
}

async function handleSubmit() {

  try {
    const book_room_id = await getRoomId(); 

    const formData = new FormData();
    formData.append('book_name', form.title);
    formData.append('year_written', form.year);
    formData.append('available_copies', String(form.copies));
    formData.append('book_room_id', String(book_room_id));
    if (form.image) {
      formData.append('productImage', form.image);
    }

    const book = await $fetch(`${config.public.backend_url}/api/books/create`, {
      method: 'POST',
      body: formData
    }) as any;

    let bookId = book.data.id

    // Recorrer la lista de autores introducidos
    for (const author of form.authors) {
      if (!author.name) continue; // Saltar autores vacíos

      // Verificar si el autor existe en la base de datos
      const existingAuthor = await $fetch(`${config.public.backend_url}/api/main_authors/by-name/${encodeURIComponent(author.name)}`, {
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
        }) as any;
        authorId = newAuthor.id;
      } else {
        authorId = existingAuthor.id;
      }

        // Asociar el autor al libro usando associateBookWithAuthor
        await $fetch(`${config.public.backend_url}/api/main_authors/associate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookId: bookId,
            mainAuthorId: authorId
          })
        });

    const keywords = form.keywords.split(',').map(k => k.trim()).filter(k => k);
    push(keywords.toString())
    // Recorrer la lista de palabras clave introducidas
    if(keywords.length>0){
    for (const keyword of keywords) {
      if (!keyword) continue; // Saltar palabras clave vacías

      // Verificar si la palabra clave existe en la base de datos
      let existingKeyword;
      try {
        existingKeyword = await $fetch(`${config.public.backend_url}/api/key_words/name/${keyword}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        existingKeyword = null;
      }

      let keywordId;
      let newKeyword
      if (!existingKeyword) {
        // Si no existe, agregarla usando createKeyWord
        newKeyword = await $fetch(`${config.public.backend_url}/api/key_words/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key_word_name: keyword
          })
        });
        keywordId = newKeyword.id;
      } else {
        keywordId = existingKeyword.id;
      }

        // Asociar la palabra clave al libro usando associateBookWithKeyWord
        await $fetch(`${config.public.backend_url}/api/key_words/associate/${bookId}/${keywordId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
    }}

    await navigateTo('/technician/books/all');

    }
    } catch (error: any) {
    push('Error al agregar el libro: ' + error.message);
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
