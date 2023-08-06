<template>
  <Suspense>
    <div class="p-4">
      <h1 class="text-4xl font-black tracking-wider">Blazing Fast Search Engine 🚀</h1>
      <label for="search" class="block mt-4 text-slate-600">Search</label>
      <input
        type="text"
        v-model="searchQuery"
        class="w-full p-2 px-4 border border-gray-300 rounded-full mt-1 placeholder:text-gray-300 focus:outline-0"
        placeholder="Search book by title or author name"
      />
      <div v-if="!initialLoading" class="scrolling-component" ref="scrollComponent">
        <ul>
          <BookListItem v-for="book in books" :key="book.id" :book="book" />
        </ul>
      </div>
      <BookListItemSkeleton v-for="item in 2" :key="item" v-if="loading || initialLoading" />
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
const scrollComponent = ref<HTMLElement | null>(null);

// ============ Methods ==============
const handleScroll = () => {
  const element = scrollComponent.value;
  if (!loading.value && element && element.getBoundingClientRect().bottom < window.innerHeight) {
    loadMore();
  }
};

const loadMore = async () => {
  loading.value = true;
  await fetchBooks({ isInitialReq: false });
  loading.value = false;
};

const fetchBooks = async ({
  searchKey = "",
  isInitialReq = true,
  isSearching = false,
}: { searchKey?: string; isInitialReq?: boolean; isSearching?: boolean }) => {
  try {
    if (isInitialReq) initialLoading.value = true;
    const response = await axios.get("http://localhost:3000/api/books", {
      params: {
        searchKey,
        cursor: cursor.value,
        limit: limit.value,
      },
    });

    if (isSearching) {
      books.value = response.data.data;
    } else {
      books.value.push(...response.data.data);
    }

    cursor.value = response.data.nextCursor;
    initialLoading.value = false;
  } catch (error) {
    console.error(error);
    initialLoading.value = false;
  }
};

const debouncedFetchBooksWrapper = (searchKey: string) => {
  cursor.value = 0;
  fetchBooks({ searchKey, isSearching: true });
};

// Debounce the fetchBooks function with 1500ms delay
const debouncedFetchBooks = debounce(debouncedFetchBooksWrapper, 500);

// ============ Lifecycle Hooks ==============
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// created hook
fetchBooks({ searchKey: searchQuery.value });

// ============ Watcher ==============
watch(searchQuery, (newValue) => {
  debouncedFetchBooks(newValue);
  cursor.value = 0;
});
</script>
