<template>
  <header
    class=""
  >
    <nav class="nav-bar fix-top">
      <div class="nav-container">
        <RouterLink
          :to="{ name: 'Home' }"
          class="shrink-0 text-2xl font-bold tracking-tight text-[#006c49]"
          aria-label="VNC Mart home"
        >
          <img src="/public/images/vnc-logo.jpg" class="head-logo">
        </RouterLink>

        <form
          class="relative hidden flex-1 md:block md:max-w-md"
          role="search"
          @submit.prevent="submitSearch"
        >
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >search</span
          >
          <input
            v-model.trim="searchTerm"
            class="h-11 w-full rounded-xl border-0 bg-gray-50 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#006c49]/20"
            placeholder="Search fresh groceries..."
            type="search"
          />
        </form>

        <nav class="hidden items-center gap-6 lg:flex menu-items" aria-label="Customer categories">
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
          <button
            type="button"
            class="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-800 transition hover:bg-emerald-50 active:scale-95"
            aria-label="Open cart"
            :aria-expanded="isCartOpen"
            @click="openCart"
          >
            <span class="material-symbols-outlined">shopping_cart</span>
            <span
              v-if="cartCount > 0"
              class="absolute right-0.5 top-0.5 min-w-5 rounded-full border-2 border-white bg-amber-400 px-1 text-center text-[10px] font-bold leading-4 text-[#684000]"
            >
              {{ cartCount }}
            </span>
          </button>

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
                <p class="truncate text-sm font-semibold text-gray-900">
                  {{ authStore.currentUser?.fullName }}
                </p>
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
    </nav>

    <div v-if="isMobileMenuOpen" class="border-t border-gray-100 bg-white py-4 lg:hidden">
      <div class="app-container">
        <form class="relative mb-4 md:hidden" role="search" @submit.prevent="submitSearch">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            >search</span
          >
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
    </div>
  </header>

  <CartDrawer v-model:items="cartItems" :open="isCartOpen" @close="isCartOpen = false" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CartDrawer from './CartDrawer.vue'

interface HeaderLink {
  label: string
  to: RouteLocationRaw
}

interface CartDrawerItem {
  id: number
  name: string
  unit: string
  price: number
  quantity: number
  image: string
}

const router = useRouter()
const authStore = useAuthStore()

const cartItems = ref<CartDrawerItem[]>([
  {
    id: 1,
    name: 'Vine-Ripened Tomatoes',
    unit: '500g Pack',
    price: 45000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBK44bpPb41zCYjtH8XqaI9lviWMcnWC7Vf6lGZMTOl4SUOUMMuFtFf8axhkvBfJocPWQhjL0xvJYNE6fWM4VXNtLnPsu97kQ4WYUrUKs8IlNojpKrmYK6qEEZrZ4fmeDAHAFxjptdESP9oEsLEP1GQwwEgxcqw1-rqmpXs3San6XHA2IyjjbG4XDJsCe-aatGEslqFPKWOBAtQh0zWDFTxSbUpqrh1SBJ6PhQmp5hW5XMiv0FtI8tmdAVBpfl3dkB1a4AfS0L-QhAk',
  },
  {
    id: 3,
    name: 'Artisan Sourdough',
    unit: 'Large Loaf',
    price: 32000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAbCsNKlFNeudY-erRe6hDCaE5FMuGVySjsJ3c3iKd3m8r47OVzR8VOcSc6rJw6TcAwHZUBoyNQYtdOdKOJQQPYIBuIdf7OPVNjKjjgf2f1LEM2MpNxIYBGZ1A2Mgs1Ztul5WwcfaFWw__qDttAFEIITAANVBfAydHAJ0wYEjBtizyHM59tfCjiyQbUUIuilo_ZcjWOmbOX1XYGtK7o4128f6g8E96yDDGUoGkczz843eaM6j8Bv0W4C04Og8MWsqoTRJTWGSOvn5dr',
  },
  {
    id: 4,
    name: 'Grass-Fed Milk',
    unit: '1L Bottle',
    price: 18000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGa3kkcebhOkMHOIYDMOKoV6ct3lVBBXy4rqZWYNtcbD4UZQ5b36J3mXXU0B9Ut6vAyMuDSTP1443vZq_n3VdbE-Y9Q4539YP0HQJSLmBm88anlZNvKza3sdyzrEVSwzUL5DIFWG4lNRL_WwvjdH4eKk5ML1hseC-H-wv_1JKdxL1WjuwgX7PCuaZ8oMXgVYPzB1NuHec1mRNNTBfbusBr83cuYl-v3u91Zd1QhT3dJOipMz4St6MYnAkP9ek_onCbBJnKce-MAOrD',
  },
])
const searchTerm = ref('')
const isMobileMenuOpen = ref(false)
const isAccountMenuOpen = ref(false)
const isCartOpen = ref(false)
const cartCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0))

const categoryLinks: HeaderLink[] = [
  { label: 'Vegetables', to: { name: 'Home', query: { category: 'vegetables' } } },
  { label: 'Fruits', to: { name: 'Home', query: { category: 'fruits' } } },
  { label: 'Dairy', to: { name: 'Home', query: { category: 'dairy' } } },
  { label: 'Meat', to: { name: 'Home', query: { category: 'meat' } } },
  { label: 'Bakery', to: { name: 'Home', query: { category: 'bakery' } } },
]

function closeMenus() {
  isMobileMenuOpen.value = false
  isAccountMenuOpen.value = false
}

function openCart() {
  closeMenus()
  isCartOpen.value = true
}

function submitSearch() {
  const query = searchTerm.value ? { search: searchTerm.value } : {}
  closeMenus()
  router.push({ name: 'Home', query })
}

function logout() {
  authStore.logout()
  closeMenus()
  router.push({ name: 'Home' })
}
</script>
<style type="scope">
  .head-logo{
    height: 60px;
  }
  .menu-items a{
    font-size: 18px;
    font-weight: 600;
    color: #006c49;
    height: 4rem;
    align-content: center;
    min-width: 100px;
  }
  .menu-items a:hover{
    background-color: #006c49;
    color: white;
  }
</style>