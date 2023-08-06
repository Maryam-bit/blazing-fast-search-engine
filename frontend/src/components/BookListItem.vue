<template>
  <li class="border-b border-gray-300 py-4">
    <h2 class="text-2xl font-normal">{{ book.book_title }}</h2>
    <p class="text-gray-600">{{ book.book_author }}</p>
  </li>
</template>

<script lang="ts" setup>
// ========================= Interfaces =========================
export interface Book {
  book_title: string;
  book_author: string;
}

export interface Props {
  book: Book;
}

// ========================= props =========================
defineProps<Props>();
</script>
