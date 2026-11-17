<template>
  <div class="space-y-8 py-8">
    <header class="space-y-2">
      <p class="text-sm font-semibold uppercase tracking-wider text-[#2b6954]">VNC Mart</p>
      <h1 class="text-3xl font-bold text-[#006c49]">
        {{ selectedCategory?.name ?? 'All Products' }}
      </h1>
      <p class="text-gray-500">Browse fresh products from our categories.</p>
    </header>

    <form class="flex max-w-xl gap-2" role="search" @submit.prevent="submitSearch">
      <input
        v-model.trim="searchTerm"
        class="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#006c49] focus:ring-2 focus:ring-[#006c49]/20"
        type="search"
        placeholder="Search products..."
      />
      <button
        type="submit"
        class="rounded-xl bg-[#006c49] px-5 font-semibold text-white transition hover:bg-[#00563a]"
      >
        Search
      </button>
    </form>

    <nav class="hide-scrollbar flex gap-3 overflow-x-auto pb-2" aria-label="Filter by category">
      <RouterLink
        :to="productsLocation()"
        class="shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition"
        :class="!categorySlug ? 'border-[#006c49] bg-[#006c49] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-[#006c49]'"
      >
        All products
      </RouterLink>
      <RouterLink
        v-for="category in catalog.categories"
        :key="category.id"
        :to="productsLocation(category.slug)"
        class="shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition"
        :class="categorySlug === category.slug ? 'border-[#006c49] bg-[#006c49] text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-[#006c49]'"
      >
        {{ category.name }}
      </RouterLink>
    </nav>

    <p class="text-sm text-gray-500">{{ filteredProducts.length }} products</p>
    <div v-if="filteredProducts.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
    <p v-else class="rounded-2xl bg-white p-8 text-center text-gray-500">
      No products found. Try another category or search term.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import catalog from '@/data/home-products.json'
import ProductCard from '@/components/customer/ProductCard.vue'
import type { HomeProduct } from '@/types/homeCatalog'

const route = useRoute()
const router = useRouter()
const searchTerm = ref(typeof route.query.search === 'string' ? route.query.search : '')
const categorySlug = computed(() =>
  typeof route.query.category === 'string' ? route.query.category : '',
)
const selectedCategory = computed(() =>
  catalog.categories.find((category) => category.slug === categorySlug.value),
)
const allProducts = computed(() =>
  catalog.categories.flatMap((category) => category.products as HomeProduct[]),
)
const filteredProducts = computed(() => {
  const search = typeof route.query.search === 'string' ? route.query.search.trim().toLowerCase() : ''

  return allProducts.value.filter((product) => {
    const matchesCategory = !categorySlug.value || product.category === categorySlug.value
    const matchesSearch = !search || product.name.toLowerCase().includes(search)
    return matchesCategory && matchesSearch
  })
})

watch(
  () => route.query.search,
  (search) => {
    searchTerm.value = typeof search === 'string' ? search : ''
  },
)

function productsLocation(category?: string) {
  return {
    name: 'Products',
    query: {
      ...(category ? { category } : {}),
      ...(typeof route.query.search === 'string' ? { search: route.query.search } : {}),
    },
  }
}

function submitSearch() {
  router.push({
    name: 'Products',
    query: {
      ...(categorySlug.value ? { category: categorySlug.value } : {}),
      ...(searchTerm.value ? { search: searchTerm.value } : {}),
    },
  })
}
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
