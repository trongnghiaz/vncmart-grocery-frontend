<template>
  <CustomerHeader v-if="showHeader" />
  <main :class="{ 'app-container page-shell': showHeader }">
    <RouterView />
  </main>
  <CustomerFooter />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CustomerHeader from './CustomerHeader.vue'
import CustomerFooter from './CustomerFooter.vue'

const route = useRoute()
const showHeader = computed(() => route.name !== 'Login')
</script>
