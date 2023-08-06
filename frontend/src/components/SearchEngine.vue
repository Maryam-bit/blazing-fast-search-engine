<template>
  <Suspense>
    <div class="p-4">
      <h1 class="text-4xl font-bold">Blazing Fast Search Engine</h1>
      <label for="search" class="block mt-4">Search</label>
      <input
        type="text"
        v-model="searchQuery"
        class="w-full p-2 border border-gray-300 rounded mt-1"
      />
      <h1 v-if="initialLoading" class="mt-4">Loading....</h1>
      <div v-else class="scrolling-component" ref="scrollComponent">
        <ul>
          <BookListItem v-for="book in books" :key="book.id" :book="book" />
          <BookListItemSkeleton v-for="item in 3" :key="item" v-if="loading" />
        </ul>
      </div>
    </div>
  </Suspense>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, watch, onMounted, onUnmounted } from "vue";
import debounce from "lodash.debounce";
import BookListItem from "./BookListItem.vue";
import BookListItemSkeleton from "./BookListItemSkeleton.vue";

// ============ Variable ==============
const searchQuery = ref("");
const books: any = ref([]);
const initialLoading = ref(false);
const loading = ref(false);
const cursor = ref(0);
const limit = ref(10);
const scrollComponent = ref(null);
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
})

onUnmounted(() => {
  window.addEventListener("scroll", handleScroll)
})

const handleScroll = () => {
  let element: any = scrollComponent.value;
  if (!loading.value && element.getBoundingClientRect().bottom < window.innerHeight) {
    loadMore()
  }
}

const loadMore = async () => {
  loading.value = true;
  await fetchBooks({isInitialReq: false});
  loading.value = false;
};

// ============ Methods ==============
const fetchBooks = async ({
    searchKey = "",
    isInitialReq = true,
    isSearching = false,
}) => {
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

    if(isSearching) {
        books.value = response.data.data;
    }
    else {
        books.value.push(...response.data.data);
    }

    cursor.value = response.data.nextCursor;
    console.log(books.value, "books");
    initialLoading.value = false;
  } catch (error) {
    console.error(error);
    initialLoading.value = false;
  }
};
fetchBooks({searchKey: searchQuery.value});

const debouncedFetchBooksWrapper = (searchKey: string) => {
  cursor.value = 0;
  fetchBooks({searchKey: searchKey, isSearching: true});
};

// Debounce the fetchBooks function with 500ms delay
const debouncedFetchBooks = debounce(debouncedFetchBooksWrapper, 1500);

// ============ Watcher ==============
watch(searchQuery, (newValue, oldValue) => {
  debouncedFetchBooks(newValue);
  cursor.value = 0;
});
</script>

<style>
/* Add any specific styles for the main component here */
</style>
