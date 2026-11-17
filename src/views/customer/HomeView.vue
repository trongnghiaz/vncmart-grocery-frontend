<template>
  <div class="space-y-10">
    <section
      class="relative mt-4 flex min-h-90 items-center overflow-hidden bg-[#006c49] sm:min-h-[420px]"
    >
      <div class="absolute inset-0 z-0">
        <div
          class="h-full w-full bg-cover bg-center opacity-80 mix-blend-overlay"
          style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTSmdSdMJPGEQ2Xvn4mpYk-VvuOWwTmygMs3uzZjCioYXpSZDhUEAzKDU7pMEZHjJAA9QNCML0W08hO4I3UMdQYimR591iKKSG8INrmOjhFLwhf2O4jdzo60ADM2YW6ouRhZUcPf-DIIJH4V2VYQK-hpAmaZ693j3Rlf4RnmTdw9SZar755wEhT865SqKJwHQngIimXDwK2zS9WvkpbhCZ9KBiYpMwQ8wRUuhI4SwrM1zdM3HHqhfwBS6JVwADR_sb5aph9l6WZ1GG')"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#006c49] via-[#006c49]/70 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-2xl px-6 py-12 sm:px-12">
        <span
          class="mb-6 inline-block rounded-full bg-[#6ffbbe] px-4 py-1.5 text-xs font-semibold text-[#002113]"
          >Market Fresh Daily</span
        >
        <h1 class="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl">
          Fresh Groceries Delivered To Your Doorstep.
        </h1>
        <p class="mb-8 max-w-md text-base text-[#6ffbbe]/90 sm:text-lg">
          Quality hand-picked produce from local farms, delivered within 2 hours of your order.
        </p>
        <RouterLink
          :to="{ name: 'Products' }"
          class="inline-block rounded-xl bg-white px-8 py-4 font-bold text-[#006c49] shadow-lg transition-all hover:shadow-[#006c49]/20 active:scale-95"
        >
          Shop Now
        </RouterLink>
      </div>
      <div class="float-element absolute right-12 top-1/2 hidden -translate-y-1/2 xl:block">
        <div class="glass-panel flex items-center gap-4 rounded-3xl p-6 shadow-xl">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <span class="material-symbols-outlined text-4xl text-[#006c49]">rocket_launch</span>
          </div>
          <div>
            <div class="font-semibold text-gray-800">Flash Delivery</div>
            <div class="text-sm text-gray-500">Under 30 Mins</div>
          </div>
        </div>
      </div>
    </section>

    <section
      v-for="category in catalog.categories"
      :key="category.id"
      class="product-section"
      :aria-labelledby="`category-${category.slug}`"
    >
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 :id="`category-${category.slug}`" class="text-2xl font-bold text-[#006c49]">
            {{ category.name }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">Fresh picks from {{ category.name.toLowerCase() }}.</p>
        </div>
        <RouterLink
          :to="{ name: 'Products', query: { category: category.slug } }"
          class="flex shrink-0 items-center gap-1 font-semibold text-[#006c49] hover:underline"
        >
          View all
          <span class="material-symbols-outlined text-xl">arrow_forward</span>
        </RouterLink>
      </div>

      <div class="product-row hide-scrollbar" tabindex="0" :aria-label="`${category.name} products`">
        <ProductCard
          v-for="product in category.products.slice(0, 6)"
          :key="product.id"
          :product="product"
          layout="carousel"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import catalog from '@/data/home-products.json'
import ProductCard from '@/components/customer/ProductCard.vue'
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.float-element {
  animation: subtle-float 6s ease-in-out infinite;
}

.product-section {
  padding: 0 2rem;
}

.product-row {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 0.5rem 0 1.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.product-row :deep(.product-card) {
  scroll-snap-align: start;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

@keyframes subtle-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
