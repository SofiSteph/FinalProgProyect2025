<template>
  <div class="sort-buttons-container">
    <div class="filter-button">
      <input
        v-model="author"
        @input="filterByAuthor"
        placeholder="Filtrar por Autor"
        class="filter-input"
      />
    </div>
    <div class="filter-button">
      <input
        v-model="date"
        @input="filterByDate"
        placeholder="Filtrar por Fecha"
        class="filter-input"
      />
    </div>
    <div class="filter-button">
      <input
        v-model="keyword"
        @input="filterByKeyword"
        placeholder="Filtrar por palabra clave"
        class="filter-input"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const author = ref('')
const date = ref('')
const keyword = ref('')

const emit = defineEmits(['filter-author', 'filter-date', 'filter-keyword'])

function filterByAuthor() {
  emit('filter-author', author.value)
}

function applyAuthorFilter() {
  emit('filter-author', author.value)
}

function filterByDate() {
  emit('filter-date', date.value)
}

function applyDateFilter() {
  emit('filter-date', date.value)
}

function filterByKeyword() {
  emit('filter-keyword', keyword.value)
}

function applyFilter() {
  emit('filter-keyword', keyword.value)
}
</script>

<style scoped>
.sort-buttons-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.sort-button {
  padding: 10px 20px;
  background-color: #372f2f;
  color: #d9d9d9;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
}

.sort-button:hover {
  background-color: #93877e;
}

.filter-button {
  display: flex;
  align-items: center;
  background-color: #372f2f;
  border-radius: 5px;
  padding: 5px;
}

.filter-input {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 3px;
  background-color: #d9d9d9;
  color: #372f2f;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
}

.filter-btn {
  padding: 8px 12px;
  background-color: #93877e;
  color: #d9d9d9;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  margin-left: 5px;
}

.filter-btn:hover {
  background-color: #a0927f;
}
</style>
