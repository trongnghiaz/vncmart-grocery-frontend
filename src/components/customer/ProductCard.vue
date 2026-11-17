<template>
  <article
    :class="[
      'product-card group relative rounded-3xl bg-white p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl',
      layout === 'carousel' ? 'w-[min(76vw,280px)] shrink-0' : 'w-full min-w-0',
    ]"
  >
    <div class="absolute left-6 top-6 z-10 flex flex-col gap-2">
      <span
        v-if="product.isFresh"
        class="rounded-full bg-[#006c49] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
        >Fresh</span
      >
      <span
        v-if="product.isOrganic"
        class="rounded-full bg-[#b0f0d6] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#002117]"
        >Organic</span
      >
      <span
        v-if="product.isHotDeal"
        class="rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600"
        >Hot Deal</span
      >
    </div>
    <RouterLink
      :to="{ name: 'ProductDetail', params: { id: product.id } }"
      class="mb-4 block aspect-square overflow-hidden rounded-2xl bg-gray-50"
      :aria-label="`View ${product.name}`"
    >
      <img
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        :src="product.image"
        :alt="product.name"
      />
    </RouterLink>
    <div class="px-1">
      <p class="mb-1 text-xs font-semibold uppercase tracking-wider text-[#2b6954]">
        {{ product.categoryName }}
      </p>
      <RouterLink :to="{ name: 'ProductDetail', params: { id: product.id } }">
        <h3 class="mb-2 truncate text-base font-bold text-gray-800 transition-colors hover:text-[#006c49]">
          {{ product.name }}
        </h3>
      </RouterLink>
      <div class="mb-4 flex items-center gap-1">
        <span class="material-symbols-outlined style-filled text-sm text-amber-400">star</span>
        <span class="text-sm font-semibold text-gray-800">{{ product.rating }}</span>
        <span class="text-xs text-gray-400">({{ product.reviews }} reviews)</span>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-lg font-bold text-[#006c49]">{{ formatPrice(product.price) }}</div>
          <div class="text-sm text-gray-400 line-through">{{ formatPrice(product.oldPrice) }}</div>
        </div>
        <button
          type="button"
          :aria-label="`Add ${product.name} to cart`"
          :class="[
            'flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-all active:scale-95',
            added ? 'bg-[#2b6954]' : 'bg-[#006c49]',
          ]"
          @click="addToCart"
        >
          <span class="material-symbols-outlined">{{ added ? 'check_circle' : 'add_shopping_cart' }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { HomeProduct } from '@/types/homeCatalog'

defineProps<{ product: HomeProduct; layout?: 'carousel' | 'grid' }>()
const added = ref(false)

function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(value)
    .replace('₫', 'đ')
}

function addToCart() {
  if (added.value) return

  added.value = true
  setTimeout(() => {
    added.value = false
  }, 2000)
}
</script>

<style scoped>
.style-filled {
  font-variation-settings: 'FILL' 1;
}
</style>
