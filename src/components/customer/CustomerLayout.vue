<template>
  <CustomerHeader v-if="showHeader" />
  <main class="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CustomerHeader from './CustomerHeader.vue';

const route = useRoute();
const showHeader = computed(() => route.name !== 'Login');
</script>
