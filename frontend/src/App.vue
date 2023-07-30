<template>
  <Suspense>
    <div>
      <h1>Blazing Fast Search Engine</h1>
      <label for="search">Search</label>
      <input type="text" v-model="searchQuery">
      <h1 v-if="loading">Loading....</h1>
      <ul v-else="!loading">
        <li v-for="book in books" :key="book.id">{{ book.book_title }}</li>
      </ul>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";

const searchQuery = ref("");
const books = ref([]);
const loading = ref(false);
const fetchBooks = async () => {
  try {
    loading.value = true;
    const response = await axios({
      method: 'get',
      url: 'http://localhost:3000/api/books',
    });
    books.value = response.data.data;
    console.log(books.value, "bbooks")
    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};

fetchBooks();
</script>
