<template>
  <div class="space-y-10">
    <!-- Hero Banner -->
    <section class="relative mt-4 flex min-h-90 items-center overflow-hidden bg-[#006c49] sm:min-h-[420px]">
      <div class="absolute inset-0 z-0">
        <div class="w-full h-full bg-cover bg-center opacity-80 mix-blend-overlay" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTSmdSdMJPGEQ2Xvn4mpYk-VvuOWwTmygMs3uzZjCioYXpSZDhUEAzKDU7pMEZHjJAA9QNCML0W08hO4I3UMdQYimR591iKKSG8INrmOjhFLwhf2O4jdzo60ADM2YW6ouRhZUcPf-DIIJH4V2VYQK-hpAmaZ693j3Rlf4RnmTdw9SZar755wEhT865SqKJwHQngIimXDwK2zS9WvkpbhCZ9KBiYpMwQ8wRUuhI4SwrM1zdM3HHqhfwBS6JVwADR_sb5aph9l6WZ1GG')"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#006c49] via-[#006c49]/70 to-transparent"></div>
      </div>
      <div class="relative z-10 max-w-2xl px-6 py-12 sm:px-12">
        <span class="inline-block px-4 py-1.5 bg-[#6ffbbe] text-[#002113] rounded-full font-semibold text-xs mb-6">Market Fresh Daily</span>
        <h1 class="mb-6 text-3xl font-bold leading-tight text-white sm:text-4xl">Fresh Groceries Delivered To Your Doorstep.</h1>
        <p class="mb-8 max-w-md text-base text-[#6ffbbe]/90 sm:text-lg">Quality hand-picked produce from local farms, delivered within 2 hours of your order.</p>
        <button type="button" class="bg-white text-[#006c49] px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-[#006c49]/20 transition-all active:scale-95">
          Shop Now
        </button>
      </div>
      <!-- Decorative Floating Element -->
      <div class="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:block float-element">
        <div class="glass-panel p-6 rounded-3xl shadow-xl flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <span class="material-symbols-outlined text-[#006c49] text-4xl">rocket_launch</span>
          </div>
          <div>
            <div class="font-semibold text-gray-800">Flash Delivery</div>
            <div class="text-sm text-gray-500">Under 30 Mins</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Pills -->
    <section class="overflow-x-auto pb-1 hide-scrollbar">
      <div class="flex gap-4 min-w-max">
        <button 
          v-for="category in categories" 
          :key="category.id"
          type="button"
          @click="selectedCategory = category.id"
          :class="['px-6 py-3 rounded-full font-semibold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2', 
                    selectedCategory === category.id ? 'bg-[#006c49] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#006c49] hover:text-[#006c49]']"
        >
          <span v-if="category.icon" class="material-symbols-outlined text-[18px]">{{ category.icon }}</span>
          {{ category.name }}
        </button>
      </div>
    </section>

    <!-- Product Grid -->
    <section class="product-grid">
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-2xl font-bold recommended">Recommended for You</h2>
          <p class="text-sm text-gray-500">Top freshness picks based on your recent activity.</p>
        </div>
        <div class="flex shrink-0 gap-2">
          <button type="button" class="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <span class="material-symbols-outlined">filter_list</span>
          </button>
          <select v-model="sortBy" class="border-gray-200 rounded-lg text-sm py-2 px-4 focus:ring-[#006c49] focus:border-[#006c49]">
            <option value="newest">Sort by: Newest</option>
            <option value="low-high">Price: Low to High</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>

      <!-- Danh sách sản phẩm đổ bằng v-for -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 grid-items-stretch">
        <article 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="product-card group bg-white rounded-3xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 relative"
        >
          <div class="absolute top-6 left-6 z-10 flex flex-col gap-2">
            <span v-if="product.isFresh" class="px-3 py-1 bg-[#006c49] text-white text-[10px] font-bold uppercase tracking-wider rounded-full">Fresh</span>
            <span v-if="product.isOrganic" class="px-3 py-1 bg-[#b0f0d6] text-[#002117] text-[10px] font-bold uppercase tracking-wider rounded-full">Organic</span>
            <span v-if="product.isHotDeal" class="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-full">Hot Deal</span>
          </div>
          <button type="button" class="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur rounded-full text-gray-500 hover:text-red-500 transition-colors">
            <span class="material-symbols-outlined">favorite</span>
          </button>
          <RouterLink
            :to="{ name: 'ProductDetail', params: { id: product.id } }"
            class="mb-4 block aspect-square overflow-hidden rounded-2xl bg-gray-50"
            :aria-label="`View ${product.name}`"
          >
            <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" :src="product.image" :alt="product.name"/>
          </RouterLink>
          <div class="px-1">
            <p class="text-xs font-semibold text-[#2b6954] mb-1 uppercase tracking-wider">{{ product.categoryName }}</p>
            <RouterLink :to="{ name: 'ProductDetail', params: { id: product.id } }">
              <h3 class="font-bold text-base text-gray-800 mb-2 truncate transition-colors hover:text-[#006c49]">{{ product.name }}</h3>
            </RouterLink>
            <div class="flex items-center gap-1 mb-4">
              <span class="material-symbols-outlined text-amber-400 text-sm style-filled">star</span>
              <span class="text-sm font-semibold text-gray-800">{{ product.rating }}</span>
              <span class="text-xs text-gray-400">({{ product.reviews }} reviews)</span>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <div class="font-bold text-lg text-[#006c49]">{{ formatPrice(product.price) }}</div>
                <div class="text-sm text-gray-400 line-through">{{ formatPrice(product.oldPrice) }}</div>
              </div>
              <!-- Nút Thêm Vào Giỏ Hàng Xử Lý Bằng Vue State -->
              <button 
                type="button"
                @click="addToCart(product.id)"
                :class="['w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all', 
                          addedItems.includes(product.id) ? 'bg-[#2b6954]' : 'bg-[#006c49]']"
                class="text-white"
              >
                <span class="material-symbols-outlined">
                  {{ addedItems.includes(product.id) ? 'check_circle' : 'add_shopping_cart' }}
                </span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Pagination -->
    <section class="flex justify-center pb-12">
      <nav class="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm">
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xl bg-[#006c49] text-white font-semibold">1</button>
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">2</button>
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">3</button>
        <span class="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 font-semibold">12</button>
        <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </nav>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// Danh mục sản phẩm mẫu
const categories = ref([
  { id: 'all', name: 'All Items' },
  { id: 'vegetables', name: 'Vegetables', icon: 'eco' },
  { id: 'fruits', name: 'Fruits', icon: 'nutrition' },
  { id: 'meat', name: 'Meat', icon: 'restaurant' },
  { id: 'dairy', name: 'Dairy', icon: 'water_drop' },
  { id: 'bakery', name: 'Bakery', icon: 'bakery_dining' },
  { id: 'beverages', name: 'Beverages', icon: 'local_cafe' }
]);

const selectedCategory = ref('all');
const sortBy = ref('newest');

// Quản lý các ID sản phẩm vừa được bấm thêm vào giỏ hàng nhằm tạo hiệu ứng Micro-interaction
const addedItems = ref<number[]>([]);

// Khai báo mảng sản phẩm trích xuất đầy đủ thông tin từ thiết kế của Stitch
const products = ref([
  {
    id: 1,
    name: 'Organic Avocado',
    category: 'vegetables',
    categoryName: 'Vegetables',
    price: 28000,
    oldPrice: 35000,
    rating: 4.5,
    reviews: 120,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY9cbZcH5Z65meFVJR2UEXoZP4jtIyda9TetnwdH0ux7qBM7qJxPz8jyERDKQvsml60PSapmnDlwjBUgsPtwPuX9BaDD5dMNfIRt4UHTRk13WbK44XAtCGWGtfcad9THQsV8tA2V_5q0Lx53xjIjqCt_NbBEnjwPk6B9r_xUD4w5kOnpFVKug2lyzDSM0MxBm8yPr59pv43Y2o2MSyHymEKtthZrkfcs9N_KugBKNU2SJK_P0lO4D8brkg1LkXt7uiUxIq49ehcUUq',
    isFresh: true,
    isOrganic: true,
    isHotDeal: false
  },
  {
    id: 2,
    name: 'Premium Strawberries',
    category: 'fruits',
    categoryName: 'Fruits',
    price: 45000,
    oldPrice: 55000,
    rating: 4.8,
    reviews: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUDbfVtFvuzQIIRGgJhkouwbKoPW7Cyz8-ZbjqmZiUYdq0-FMCaH5FNDVt83TD-pxJl7GDXuLkUItaWtXmvelucSB6SyMO4R9hV-BEU5fn5xaRIaSeOXYR4iHp5xXyFcapFc-r1VUWhca03VGUFLgG_N1xidwPthvIm83AX4iGjYivTGcAsuq4_DXng2OwKhbcuigY7kiK44Vl0mblKPBOKGqbvewHElqc8VFYkCmn0g4eUx4mrDFj9UR14eXgnM1F52YLoyHI-jTe',
    isFresh: true,
    isOrganic: false,
    isHotDeal: false
  },
  {
    id: 3,
    name: 'Artisan Sourdough',
    category: 'bakery',
    categoryName: 'Bakery',
    price: 32000,
    oldPrice: 40000,
    rating: 4.9,
    reviews: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWJtZhNaRhzMwC7_y1mcSKNp0XN8hsJDh4B1O8YXOyEVOEgPdfA8ZRiWxFHehwdnOy7MdyUC1j7ISgI2dL4qWaDL9oTYCvyl16EMsAuhBobOXPvyp_N2Jwfv5cNxhNiiNWYleilmzQHwIjQdDgxjA4s4fi2ySAvBhc5CxVvy5OTtI4x0P7qWvr2qvITq0i5mjhSm4GZF3jSL66w8xdl9cirmw_VgNb28kUjspp7Wy9KTHbfB-hqmbpj4jRI1pcG6aOX6Zs8WF5p2cg',
    isFresh: true,
    isOrganic: false,
    isHotDeal: false
  },
  {
    id: 4,
    name: 'Whole Farm Milk',
    category: 'dairy',
    categoryName: 'Dairy',
    price: 18000,
    oldPrice: 22000,
    rating: 4.7,
    reviews: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8vwr6h2izIzk41JNH_Qbl_rlmpr0RHvvDixhX-wPT4zDf1tOOum8YE7Bikj1iYsLm5jfQaaZTfYFeRpvFHZQqy64v-RHfCUVGkPA7k_RIxGI7_6oSWrqETpLP_-AIKN6W_OS7YzHvLIIe3-YCJMu6winuOr6AfslzPbwYJLjZjwTPWlY_CQh59Acs5gVTFSWKAdDt2qHmq1Wsj9AOVhdokTj4v4O7vZWIC2lAASMLr9X67r7iksBGnUyMuvXoNX2tzenXlUc3V0yJ',
    isFresh: true,
    isOrganic: false,
    isHotDeal: true
  },
  {
    id: 5,
    name: 'Fresh Atlantic Salmon',
    category: 'meat',
    categoryName: 'Meat',
    price: 120000,
    oldPrice: 150000,
    rating: 4.6,
    reviews: 64,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBos6WOyrL2j-wQeYIvA2YRKpZKsnrqTEqYoGFBghW-f9r2-XNJzpgMLUbo7yCZ_uW69rX4b95o6yG1KR7170V0qHL2oopMzpB9Ygo4KU2f_oNtMn2qIIPWT6nrwyhB5dQD0FnEeL02L7JVtX8-2A7ZSo72uqH5M8DOoqbn8j8aAxyWdlwRzZ9EkizJPf1YyTcu1KUr3YFDvhTgw3DYX6Lg0UUaLm4BQSFTfMbtZrAuDlqp2emVg1d9q1RnM0K_MsvRVMpPsvdichm-',
    isFresh: false,
    isOrganic: false,
    isHotDeal: false
  },
  {
    id: 6,
    name: 'Organic Bananas',
    category: 'fruits',
    categoryName: 'Fruits',
    price: 12000,
    oldPrice: 15000,
    rating: 4.4,
    reviews: 156,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0AaCY9jnBYTc2PskOY89vOMEhJtsXnZxflauvDnABM7NteBu12WIYDySUU1jAcehEUa9lDr5NF1pneuDJhelhzu3JVTO-0yWaoOt4ar4flHXnN8XzE-t7QiSidkbnzT6C0gtMdhMr1V8jT3NLkEOfj_fI5Lev69OdlAxneDx1-0W3HNtA9L_yJIVThH_FP4yP4f1Ym-Gpeb_Hff3RaS2k2bxToRsP9mYv7ovzgvZ-5vMkrP9Ru4LMEb-gGHsXyhhyLDE9VkOsbH8w',
    isFresh: false,
    isOrganic: false,
    isHotDeal: false
  },
  {
    id: 7,
    name: 'Wild Forest Mushrooms',
    category: 'vegetables',
    categoryName: 'Vegetables',
    price: 38000,
    oldPrice: 45000,
    rating: 4.7,
    reviews: 28,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDj0mFje43w6QT9OWtI-e9wvfpx0yASy10tw2BI3dFloeMpl5tXelNjABJd6uSnV3Otq9xBesZ0lKfm_0WA5TgEAYUhx9iUG_UNFEPYkqUf9VX-b0G5Nc3qzvH09QIHOu-MPunJ1gQ2ACIYq2b4oD7_EwoLliAgM8fYZtq3gm25MmHqkE2GfjAu1WvjjNxMnFNuXM5mb0VMb0btSO-WKdgpK3nxklx0WPmRxr8hJcnNL7PaJfp0iaxOKpcwXXOGSxmQl3dmwnfeRpCy',
    isFresh: false,
    isOrganic: false,
    isHotDeal: false
  },
  {
    id: 8,
    name: 'Cold-Pressed Detox Green',
    category: 'beverages',
    categoryName: 'Beverages',
    price: 52000,
    oldPrice: 60000,
    rating: 4.9,
    reviews: 112,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAj_9WG45PgoWm6UbVR8MtdctLPM28CMnyKr3JxKqhDA6PIb4ID1MZT3fRcztMYpRleG_Ao3Q9jnt8e2uBGsLw5M2TfeLotGFcR09uLFQY8KQrhCS3xBNFfqdqDXkm6iswyDzzzeR9eq9KdDwZMDfNdexKnYs4_dvXhmboKJw2lV_lLamQ-JwSHmakKDkzriaPZrsc5CpkPR9hvaHRFU2l-ZtQ1cPwTrPsddzaKV3CYOMO9Gdws84OjM_MFR95O4P-nSRWpztv30y3v',
    isFresh: false,
    isOrganic: false,
    isHotDeal: false
  }
]);

// Lọc sản phẩm theo danh mục đang chọn (Computed Property)
const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value;
  }
  return products.value.filter(p => p.category === selectedCategory.value);
});

// Định dạng giá tiền Việt Nam Đồng
function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
    .format(value)
    .replace('₫', 'đ');
}

// Hàm thêm vào giỏ hàng kết hợp chuyển đổi icon trong 2 giây (Micro-interaction)
function addToCart(productId: number) {
  if (!addedItems.value.includes(productId)) {
    addedItems.value.push(productId);
    setTimeout(() => {
      // Sau 2 giây, trả lại trạng thái nút ban đầu giống như mã script gốc của Stitch
      addedItems.value = addedItems.value.filter(id => id !== productId);
    }, 2000);
  }
}
</script>

<style scoped>
.glass-panel {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.product-card:hover .add-btn-icon {
  transform: scale(1.1);
}
@keyframes subtle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.float-element {
  animation: subtle-float 6s ease-in-out infinite;
}
.style-filled {
  font-variation-settings: 'FILL' 1;
}
/* Ẩn thanh cuộn trình duyệt đối với danh mục hàng ngang */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 2rem;
}
.product-grid {
  padding: 0 2rem;
}
.product-grid h2 {
  color: #006c49;
  font-size: 28px;
  font-weight: 700;
}
.product-grid p {
  color: #6b7280;
  font-size: 20px;
}
.grid-items-stretch{
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); */
  padding: 2rem 0;
}
</style>
