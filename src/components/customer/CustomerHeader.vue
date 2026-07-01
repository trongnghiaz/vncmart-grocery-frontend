<template>
  <header class="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur">
    <div class="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <RouterLink
        :to="{ name: 'Home' }"
        class="shrink-0 text-2xl font-bold tracking-tight text-[#006c49]"
        aria-label="VNC Mart home"
      >
        VNC Mart
      </RouterLink>

      <form class="relative hidden flex-1 md:block md:max-w-md" role="search" @submit.prevent="submitSearch">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input
          v-model.trim="searchTerm"
          class="h-11 w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#006c49]/20"
          placeholder="Search fresh groceries..."
          type="search"
        />
      </form>

      <nav class="hidden items-center gap-6 lg:flex" aria-label="Customer categories">
        <RouterLink
          v-for="link in categoryLinks"
          :key="link.label"
          :to="link.to"
          class="border-b-2 border-transparent pb-1 text-sm font-semibold text-gray-600 transition hover:text-[#006c49]"
          active-class="border-[#006c49] text-[#006c49]"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex shrink-0 items-center gap-2 sm:gap-3">
        <RouterLink
          :to="{ name: 'Cart' }"
          class="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-emerald-50 active:scale-95"
          aria-label="Open cart"
        >
          <span class="material-symbols-outlined">shopping_cart</span>
          <span
            v-if="cartCount > 0"
            class="absolute right-0.5 top-0.5 min-w-5 rounded-full border-2 border-white bg-amber-400 px-1 text-center text-[10px] font-bold leading-4 text-[#684000]"
          >
            {{ cartCount }}
          </span>
        </RouterLink>

        <div class="relative">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-emerald-50 active:scale-95"
            :aria-expanded="isAccountMenuOpen"
            aria-label="Open account menu"
            @click="isAccountMenuOpen = !isAccountMenuOpen"
          >
            <span class="material-symbols-outlined">person</span>
          </button>

          <div
            v-if="isAccountMenuOpen"
            class="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
          >
            <div v-if="authStore.isAuthenticated" class="border-b border-gray-100 px-4 py-3">
              <p class="truncate text-sm font-semibold text-gray-900">{{ authStore.currentUser?.fullName }}</p>
              <p class="truncate text-xs text-gray-500">{{ authStore.currentUser?.account }}</p>
            </div>

            <RouterLink
              v-if="!authStore.isAuthenticated"
              :to="{ name: 'Login' }"
              class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              @click="closeMenus"
            >
              <span class="material-symbols-outlined text-[20px]">login</span>
              Login
            </RouterLink>

            <RouterLink
              v-else
              :to="{ name: 'OrderHistory' }"
              class="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              @click="closeMenus"
            >
              <span class="material-symbols-outlined text-[20px]">receipt_long</span>
              Orders
            </RouterLink>

            <button
              v-if="authStore.isAuthenticated"
              type="button"
              class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
              @click="logout"
            >
              <span class="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </button>
          </div>
        </div>

        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-emerald-50 active:scale-95 lg:hidden"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Open navigation menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <span class="material-symbols-outlined">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
      <form class="relative mb-4 md:hidden" role="search" @submit.prevent="submitSearch">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        <input
          v-model.trim="searchTerm"
          class="h-11 w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#006c49]/20"
          placeholder="Search fresh groceries..."
          type="search"
        />
      </form>

      <nav class="grid grid-cols-2 gap-2" aria-label="Mobile customer categories">
        <RouterLink
          v-for="link in categoryLinks"
          :key="link.label"
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-emerald-50 hover:text-[#006c49]"
          active-class="bg-emerald-50 text-[#006c49]"
          @click="closeMenus"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, type RouteLocationRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

interface HeaderLink {
  label: string;
  to: RouteLocationRaw;
}

const router = useRouter();
const authStore = useAuthStore();

const cartCount = ref(0);
const searchTerm = ref('');
const isMobileMenuOpen = ref(false);
const isAccountMenuOpen = ref(false);

const categoryLinks: HeaderLink[] = [
  { label: 'Vegetables', to: { name: 'Home', query: { category: 'vegetables' } } },
  { label: 'Fruits', to: { name: 'Home', query: { category: 'fruits' } } },
  { label: 'Dairy', to: { name: 'Home', query: { category: 'dairy' } } },
  { label: 'Meat', to: { name: 'Home', query: { category: 'meat' } } },
  { label: 'Bakery', to: { name: 'Home', query: { category: 'bakery' } } },
];

function closeMenus() {
  isMobileMenuOpen.value = false;
  isAccountMenuOpen.value = false;
}

function submitSearch() {
  const query = searchTerm.value ? { search: searchTerm.value } : {};
  closeMenus();
  router.push({ name: 'Home', query });
}

function logout() {
  authStore.logout();
  closeMenus();
  router.push({ name: 'Home' });
}
</script>
