<template>
  <div class="space-y-12">
    <nav class="flex flex-wrap items-center gap-1 text-xs font-semibold text-gray-500">
      <RouterLink :to="{ name: 'Home' }" class="hover:text-[#006c49]">Home</RouterLink>
      <span class="material-symbols-outlined text-[16px]">chevron_right</span>
      <RouterLink :to="{ name: 'Home', query: { category: product.categorySlug } }" class="hover:text-[#006c49]">
        {{ product.categoryName }}
      </RouterLink>
      <span class="material-symbols-outlined text-[16px]">chevron_right</span>
      <span class="text-[#006c49]">{{ product.name }}</span>
    </nav>

    <section class="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div class="space-y-4 lg:col-span-7">
        <div class="aspect-square overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <img class="h-full w-full object-cover" :src="selectedImage.src" :alt="selectedImage.alt" />
        </div>

        <div class="grid grid-cols-4 gap-3 sm:gap-4">
          <button
            v-for="image in product.images"
            :key="image.src"
            type="button"
            :class="[
              'aspect-square overflow-hidden rounded-xl border transition',
              selectedImage.src === image.src ? 'border-2 border-[#006c49]' : 'border-gray-200 hover:border-[#006c49]',
            ]"
            @click="selectedImage = image"
          >
            <img class="h-full w-full object-cover" :src="image.src" :alt="image.alt" />
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:col-span-5">
        <div class="mb-3">
          <span class="inline-block rounded-full bg-emerald-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#006c49]">
            {{ product.categoryName }}
          </span>
        </div>

        <h1 class="mb-3 text-3xl font-bold leading-tight text-gray-900 sm:text-5xl">{{ product.name }}</h1>

        <div class="mb-6 flex flex-wrap items-center gap-2">
          <div class="flex text-amber-400">
            <span v-for="(icon, index) in ratingIcons" :key="`${icon}-${index}`" class="material-symbols-outlined style-filled">{{ icon }}</span>
          </div>
          <span class="text-sm font-semibold text-gray-500">({{ product.reviewCount }} reviews)</span>
        </div>

        <div class="mb-8 flex flex-wrap items-baseline gap-3">
          <span class="text-4xl font-bold text-[#006c49]">{{ formatPrice(product.price) }}</span>
          <span v-if="product.originalPrice" class="text-lg text-gray-400 line-through">{{ formatPrice(product.originalPrice) }}</span>
          <span v-if="discountPercent > 0" class="rounded bg-red-50 px-2 py-1 text-xs font-bold text-red-700">
            {{ discountPercent }}% OFF
          </span>
        </div>

        <div class="mb-8">
          <div class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800">
            <span class="material-symbols-outlined text-[#006c49]">inventory_2</span>
            <span>{{ stockLabel }}</span>
          </div>
        </div>

        <div class="mb-8 space-y-4">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div class="flex w-fit items-center rounded-full border border-gray-300 bg-white p-1">
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
                :disabled="quantity <= 1"
                @click="decreaseQuantity"
              >
                <span class="material-symbols-outlined">remove</span>
              </button>
              <span class="w-12 text-center text-xl font-semibold text-gray-900">{{ quantity }}</span>
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100 disabled:opacity-40"
                :disabled="quantity >= product.stockQuantity"
                @click="increaseQuantity"
              >
                <span class="material-symbols-outlined">add</span>
              </button>
            </div>

            <button
              type="button"
              class="flex min-h-14 flex-1 items-center justify-center rounded-xl bg-[#006c49] px-8 py-4 text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition hover:bg-[#00422b] active:scale-[0.98] disabled:opacity-50"
              :disabled="!product.isAvailable"
              @click="markAdded"
            >
              <span class="material-symbols-outlined mr-2">{{ isAdded ? 'check_circle' : 'add_shopping_cart' }}</span>
              {{ isAdded ? 'Added to Cart' : 'Add to Cart' }}
            </button>
          </div>

          <button
            type="button"
            class="min-h-14 w-full rounded-xl bg-amber-400 px-8 py-4 text-sm font-bold text-[#684000] transition hover:bg-amber-300 active:scale-[0.98] disabled:opacity-50"
            :disabled="!product.isAvailable"
          >
            Buy Now
          </button>
        </div>

        <div class="mb-6 border-b border-gray-200">
          <div class="flex gap-6 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              :class="[
                'shrink-0 border-b-2 pb-4 text-sm font-bold transition',
                activeTab === tab.id ? 'border-[#006c49] text-[#006c49]' : 'border-transparent text-gray-500 hover:text-[#006c49]',
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <div class="text-base leading-7 text-gray-600">
          <template v-if="activeTab === 'description'">
            <p class="mb-4">{{ product.description }}</p>
            <p>{{ product.extraDescription }}</p>
          </template>

          <dl v-else-if="activeTab === 'nutrition'" class="grid grid-cols-2 gap-3">
            <div v-for="item in product.nutrition" :key="item.label" class="rounded-xl bg-gray-50 p-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-gray-500">{{ item.label }}</dt>
              <dd class="mt-1 font-bold text-gray-900">{{ item.value }}</dd>
            </div>
          </dl>

          <div v-else class="space-y-4">
            <article v-for="review in product.reviews" :key="review.author" class="rounded-xl border border-gray-200 bg-white p-4">
              <div class="mb-2 flex items-center justify-between gap-3">
                <h3 class="font-bold text-gray-900">{{ review.author }}</h3>
                <span class="text-sm font-semibold text-amber-500">{{ review.rating }} / 5</span>
              </div>
              <p>{{ review.content }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-gray-200 pt-10">
      <h2 class="mb-6 text-2xl font-bold text-gray-900">You May Also Like</h2>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        <article
          v-for="item in relatedProducts"
          :key="item.name"
          class="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition hover:shadow-lg"
        >
          <div class="relative aspect-square overflow-hidden">
            <img class="h-full w-full object-cover transition duration-500 group-hover:scale-105" :src="item.image" :alt="item.name" />
            <button
              type="button"
              class="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#006c49] text-white opacity-0 transition group-hover:opacity-100 active:scale-90"
            >
              <span class="material-symbols-outlined">add</span>
            </button>
          </div>
          <div class="p-4">
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">{{ item.categoryName }}</p>
            <h3 class="mt-1 line-clamp-2 text-sm font-bold text-gray-900">{{ item.name }}</h3>
            <p class="mt-3 text-lg font-bold text-[#006c49]">{{ formatPrice(item.price) }}</p>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

type ProductTab = 'description' | 'nutrition' | 'reviews';

interface ProductImage {
  src: string;
  alt: string;
}

interface NutritionItem {
  label: string;
  value: string;
}

interface ProductReview {
  author: string;
  rating: number;
  content: string;
}

interface ProductDetail {
  id: number;
  name: string;
  categoryName: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  isAvailable: boolean;
  description: string;
  extraDescription: string;
  images: ProductImage[];
  nutrition: NutritionItem[];
  reviews: ProductReview[];
}

interface RelatedProduct {
  name: string;
  categoryName: string;
  price: number;
  image: string;
}

const route = useRoute();
const quantity = ref(1);
const activeTab = ref<ProductTab>('description');
const isAdded = ref(false);

const product: ProductDetail = {
  id: Number(route.params.id ?? 4),
  name: 'Organic Fresh Milk',
  categoryName: 'Dairy',
  categorySlug: 'dairy',
  price: 45000,
  originalPrice: 59000,
  rating: 4.5,
  reviewCount: 120,
  stockQuantity: 20,
  isAvailable: true,
  description:
    'Sourced daily from certified organic local pastures, our Fresh Milk is processed with minimal interference to preserve its natural enzymes and creamy flavor.',
  extraDescription:
    'Our clean-label promise means no antibiotics, synthetic hormones, or pesticides. Every bottle is rich in Vitamin D and Calcium, and arrives fresh from farm to table in less than 24 hours.',
  images: [
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-w9c7LTWKfSZwRxFdmaWRvBWIO3qSX6rYi8UiKWS-YsHjjkmf3sU8JnYam-2LoiHkLIjh6UXcMTty-23fERhCX1mrYGADISwvd_ypjhMGroDRLc7HPscMR-hYCDBmMM1U8R6dOz6m-X6LkZgwF3VWDwo5j03fXTrDn34T7Jq-5oNHwTOdtgPyVluxM56D5HemmkpgeZAIwk8I8CgEl90Zy7VItpRR-M1n0UeQqeIriAMVqtxNY55Re0lODN5jqcztCE-k7PsTsX5r',
      alt: 'Organic fresh milk bottle on a bright kitchen table',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCi2yrZSGMm297BptXJ8HzlOocolSIHqYPPFNc8sjgUrMfPpBTcYRH1oRxFraLnPPoVlEGYCj-oIKeRTGewX22c_wwR7lIv_mzY7b_BATcVTnRPsyitP6Y9r6WhRMhxp6DsIpCueOiJaeqVNXfi-VmVBsPXDGyKeSswPiwesPdRcPbaMvUBLfZvQ3nFL-8wgSR5rD2ujgGWHqWQG3QtgRtcxhp4Y3wfQtDPEeyKsd24F2KExC7pSFTrorpcHmTLcKkFplypYNJz7jS1',
      alt: 'Milk being poured into a glass',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcU2wiuepc041wPvtFoGJfvfhq6V3phDbf3w3C4jW3lmygtTTXJIlA8zeztK1ww6w5tM5yxPYQOOmJd8uKyq5EPGVonXwJ80iPhBB014aHLLQHzXs0RASgaAaS_ivHCX1naKdhB76LsJP15zTSrTHMkV2asEOStFh4KfKi7m0T2072GnC1TME_L1m4RhTkyEX-YEXuhEVyGyyvACh6mOyM_gN_ABb0Z__udsuOPrCFWPiKe2BcFK11J4BESiDShXuI20MoE75k_sl6',
      alt: 'Healthy breakfast with organic milk, berries and granola',
    },
    {
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlwMLVEscDKKcqfCZuVmEQ21g1Szuv6cnWiCM-m9nLrRV8F_j-EquWuOD6KDlCsTet3uhnPEcq395x1g5t2UUbnO8lNWFGZ80IQLTh-Yv-4I3d72DUuoX7A71ZyV7zLgAk0FWr1vWdt3v5sNk27wGTmy2_D49Hjf2RW0qCe-o2FTyUWfZ0cn7ELGy8uyJdv-rAfL5l6832ym0oa7Vh_DyrCxjlTLPZslLHxYtO3Sk_7JqaSFBqm72IYjMDrvtmhRshfwJF8UBLRJr1',
      alt: 'Green pasture where dairy cows graze',
    },
  ],
  nutrition: [
    { label: 'Serving', value: '250 ml' },
    { label: 'Calories', value: '150 kcal' },
    { label: 'Protein', value: '8 g' },
    { label: 'Calcium', value: '30% DV' },
  ],
  reviews: [
    {
      author: 'Nguyen Anh',
      rating: 5,
      content: 'Milk tastes fresh and clean. The bottle arrived cold and well packed.',
    },
    {
      author: 'Linh Tran',
      rating: 4.5,
      content: 'Creamy texture, good for breakfast. I would buy it again.',
    },
  ],
};

const relatedProducts: RelatedProduct[] = [
  {
    name: 'Organic Greek Yogurt',
    categoryName: 'Dairy',
    price: 32000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB00qNvnCL21nOBNPNdjzdvHIsfegRuP4KiEzar-I4aY22WJ3tA9ysYqSmeUUgRQMpzEkCL4ZGfTT4BLJQiWP59_57dJ_inQHvA9qICx_gi-uursZ3dWAViXCkPzQUz1aV_mJkxUY-vPbU2rQVGlDfEFWDmEszvvufCLbBny5llkplYbZi33E3CKaspYLMNeaTUCD_tNE15EUnbbYMJvY9RkoVAFejQzrEq01fWz7zJm7S3pWtskPS80MCf5o3rSVd2XSI0-TDMbse1',
  },
  {
    name: 'Grass-fed Butter',
    categoryName: 'Dairy',
    price: 51000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCwlzoNp7RlDgOd-bWCy3xymixu7Rl-L7TQ2qLp2jYw5qTN_BeIP9S5sfZKyvm7JvrlsZFoSRA5rC4SVr5TSjX5MHDjEDN1O_zVHP-DW_XD7w6hipEBsf7UKYoRJUsH1XpcpXWEOsJTHG8qfh8ODd7lXbayV1pCTrw1Q8YB3W7F-jxYbXkCX1bqwOvA8sQA7yfhFwfCLQQ_rhdLFpwxEoIUIMVJ3XfrLguqrM1ZpjJyUKa6JWsjG5DT09MSEkRDbe0Gxxiwr7pv6XwZ',
  },
  {
    name: 'Aged Cheddar',
    categoryName: 'Dairy',
    price: 75000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCftdFU76cGorWhOYCbtXFSRPLiQaL7V8y98EMeZAqnMSKFPhtMxcFRIC0Yt0As1IXo2g7i-wNmLa4gngOUInpLVRSj9JFyt2Xr1Vs7Gb62IhFLC5l_xU59uHZqWvlcyFHoYzClVWHO8m2BrSvl7j2zY4xf71kNQXzlgbUfMo84nC_cHs1rIOxYaxeKhZZrdHHmvNdyRKqtUDlnC_ypUQMRYocbni8BVQkdZcfsF688yfyOczjgOOfacg7-wvICN0Mv0awCRn_plsSD',
  },
  {
    name: 'Organic Free-Range Eggs',
    categoryName: 'Dairy',
    price: 49000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD1UOfLKJ39xPoGfrcFRJZ1nTZiPG7f1boOWjiDAGBjActRVSG2PhhBI2U9Qi2Y7p4r-h_dHKaKjH7q470XFAJUEhaDe4OZ2gF0U1PvG8Lnp9MvGA28_lvaWBGh85KeNfSLLEN4KhK5mhjPO_No0zu0z_sxDAg1Kf66uCgnGEKFfZxOE9Po2CdtRgXw1BoKk6V2SbPr2bNnoPL4BjiZQD9I9YbjDyevrh3OC9EZ69Ikqz-vDUtKw-WMhOn9g2usffTEFZ42oixDkjXd',
  },
];

const tabs: Array<{ id: ProductTab; label: string }> = [
  { id: 'description', label: 'Description' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'reviews', label: 'Reviews' },
];

const selectedImage = ref<ProductImage>({
  src: product.images[0]?.src ?? '',
  alt: product.images[0]?.alt ?? product.name,
});

const ratingIcons = computed(() => {
  const icons: string[] = [];
  const fullStars = Math.floor(product.rating);

  for (let i = 0; i < fullStars; i += 1) {
    icons.push('star');
  }

  if (product.rating % 1 > 0) {
    icons.push('star_half');
  }

  return icons;
});

const discountPercent = computed(() => {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0;
  }

  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
});

const stockLabel = computed(() =>
  product.isAvailable ? `In Stock (${product.stockQuantity} units)` : 'Out of stock',
);

function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(value)
    .replace('₫', 'đ');
}

function increaseQuantity() {
  quantity.value = Math.min(quantity.value + 1, product.stockQuantity);
}

function decreaseQuantity() {
  quantity.value = Math.max(quantity.value - 1, 1);
}

function markAdded() {
  isAdded.value = true;
  window.setTimeout(() => {
    isAdded.value = false;
  }, 2000);
}
</script>

<style scoped>
.style-filled {
  font-variation-settings: 'FILL' 1;
}
</style>
