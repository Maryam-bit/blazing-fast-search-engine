<template>
  <Suspense>
    <div>
      <h1>Blazing Fast Search Engine</h1>
      <label for="search">Search</label>
      <input type="text" v-model="searchQuery" @input="onInput">
      <h1 v-if="loading">Loading....</h1>
      <ul v-else>
        <li v-for="book in books" :key="book.id">{{ book.book_title }}</li>
      </ul>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import debounce from 'lodash.debounce'

// ============ Variable ==============
const searchQuery = ref("");
const books = ref([]);
const loading = ref(false);

// ============ Methods ==============
const fetchBooks = async (searchKey: string) => {
  try {
    loading.value = true;
    const response = await axios({
      method: 'get',
      url: 'http://localhost:3000/api/books',
      params: {
        searchKey
      }
    });
    books.value = response.data.data;
    console.log(books.value, "books")
    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};
fetchBooks(searchQuery.value);

// Debounce the fetchBooks function with 500ms delay
const debouncedFetchBooks = debounce(fetchBooks, 1500);

// ============ Watcher ==============
watch(searchQuery, (newValue, oldValue) => {
  debouncedFetchBooks(newValue);
})
</script>
