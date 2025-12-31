<template>
  <User :nav="navItems"/>
  <div class="background">
    <h1 class="title">... Libros</h1>
    <Table :elements="elements" :optionValues="optionValues"/>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import Table from '~/components/Table.vue'
import User from '~/layouts/User.vue'
import { getDefaultNav } from '~/assets/getNav'
import { messages } from '~/assets/messages'
import { useFetch } from '#imports' 

const navItems = getDefaultNav()
const elements = ref([])
const optionValues = ['Ver', 'Obtener']

const { data, error, refresh, pending } = useFetch('http://localhost:4000/api/books', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
})

watch(data, (books) => {
  if (!books) return
  if (Array.isArray(books) && books.length > 0) {
    elements.value = books.map((book) => ({
      id: book.id,
      value: book.book_name,
      authors: Array.isArray(book.main_authors)
        ? book.main_authors.map(a => a.author_name)
        : (book.main_author ? [book.main_author.author_name] : []),
      year_written: book.year_written,
      key_words: Array.isArray(book.key_words)
        ? book.key_words.map(kw => kw.key_word_name)
        : []
    }))
  } else {
    elements.value = []
  }
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
</style>
