<template>
  <Suspense>
    <div>
      <h1>Blazing Fast Search Engine</h1>
      <label for="search">Search</label>
      <input type="text" v-model="searchQuery" @input="onInput" />
      <h1 v-if="initialLoading">Loading....</h1>
      <ul v-else>
        <li v-for="book in books" :key="book.id">{{ book.book_title }}</li>
      </ul>
      <button @click="loadMore">{{ loading ? "loading" : "load more" }}</button>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, watch } from "vue";
import debounce from "lodash.debounce";

// ============ Variable ==============
const searchQuery = ref("");
const books = ref([]);
const initialLoading = ref(false);
const loading = ref(false);
const cursor = ref(0);
const limit = ref(10);

const loadMore = async () => {
  loading.value = true;
  await fetchBooks("", false);
  loading.value = false;
};

// ============ Methods ==============
const fetchBooks = async (
  searchKey: string = "",
  isInitialReq: boolean = true
) => {
  try {
    if (isInitialReq) initialLoading.value = true;
    const response = await axios({
      method: "get",
      url: "http://localhost:3000/api/books",
      params: {
        searchKey,
        cursor: cursor.value,
        limit: limit.value,
      },
    });
    books.value = response.data.data;
    cursor.value = response.data.nextCursor;
    console.log(books.value, "books");
    initialLoading.value = false;
  } catch (error) {
    console.error(error);
    initialLoading.value = false;
  }
};
fetchBooks(searchQuery.value);

// Debounce the fetchBooks function with 500ms delay
const debouncedFetchBooks = debounce(fetchBooks, 1500);

// ============ Watcher ==============
watch(searchQuery, (newValue, oldValue) => {
  debouncedFetchBooks(newValue);
});
</script>
