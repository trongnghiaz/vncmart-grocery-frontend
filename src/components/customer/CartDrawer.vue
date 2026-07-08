<template>
  <Teleport to="body">
    <Transition name="cart-fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="cart-slide">
      <aside
        v-if="open"
        class="fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl"
        aria-label="Shopping cart"
        role="dialog"
        aria-modal="true"
      >
        <header class="flex items-center justify-between border-b border-emerald-100 px-6 py-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[#006c49] style-filled">shopping_basket</span>
            <h2 class="text-xl font-bold text-gray-900">
              Your Cart
              <span class="text-base font-medium text-gray-500">({{ totalQuantity }})</span>
            </h2>
          </div>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
            aria-label="Close cart"
            @click="emit('close')"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </header>

        <div v-if="items.length" class="flex-1 overflow-y-auto px-5 py-4">
          <div class="space-y-3">
            <article
              v-for="item in items"
              :key="item.id"
              class="group flex gap-4 rounded-2xl p-2 transition hover:bg-emerald-50/70"
            >
              <div class="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <img class="h-full w-full object-cover" :src="item.image" :alt="item.name" />
              </div>

              <div class="flex min-w-0 flex-1 flex-col justify-between py-1">
                <div>
                  <div class="flex items-start justify-between gap-3">
                    <h3 class="truncate text-sm font-bold text-gray-900">{{ item.name }}</h3>
                    <button
                      type="button"
                      class="text-gray-400 opacity-100 transition hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
                      :aria-label="`Remove ${item.name}`"
                      @click="removeItem(item.id)"
                    >
                      <span class="material-symbols-outlined text-[19px]">delete</span>
                    </button>
                  </div>
                  <p class="text-xs font-medium text-gray-500">{{ item.unit }}</p>
                </div>

                <div class="flex items-end justify-between gap-3">
                  <div class="flex items-center gap-3 rounded-full bg-gray-100 px-2 py-1">
                    <button
                      type="button"
                      class="flex h-6 w-6 items-center justify-center rounded-full text-[#006c49] transition hover:bg-white"
                      :aria-label="`Decrease ${item.name}`"
                      @click="decreaseQuantity(item.id)"
                    >
                      <span class="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span class="min-w-4 text-center text-sm font-bold text-gray-800">{{ item.quantity }}</span>
                    <button
                      type="button"
                      class="flex h-6 w-6 items-center justify-center rounded-full text-[#006c49] transition hover:bg-white"
                      :aria-label="`Increase ${item.name}`"
                      @click="increaseQuantity(item.id)"
                    >
                      <span class="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  <span class="shrink-0 text-sm font-bold text-[#006c49]">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>
            </article>
          </div>

          <section class="mt-8 border-t border-emerald-100 pt-5">
            <h3 class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-500">You might also like</h3>
            <div class="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3">
              <div class="h-12 w-12 overflow-hidden rounded-xl bg-white">
                <img
                  class="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtK0mVBQDvF9jqs-pIT0v-z5jG1kzt8PQ4DFzeSLLd1YuMvoQoL9MZgp2UXpENR9NHuYOdGsUzCYaJlhyukwkw3tRvzd4M2y8HmIa9fanOzsjP40eK2vLpe3AiU3pOdqZbd4TWRJAKfL9tjnyeU8mVV-EDC5OE7JeElbA2McZ9fuF2ijzy6PEXIo0hIoEYsvdoqRbfhwcaUJLnRqJuMePhUtPwUT_Q9CYufFSYJ-jBTB1pY1QogTPI1cNbraiyENwOhni3x6NF4S1R"
                  alt="Organic strawberries"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold text-gray-900">Organic Strawberries</p>
                <p class="text-sm font-bold text-[#006c49]">{{ formatPrice(39900) }}</p>
              </div>
              <button
                type="button"
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006c49] text-white transition active:scale-95"
                aria-label="Add Organic Strawberries"
                @click="addRecommendedItem"
              >
                <span class="material-symbols-outlined text-[20px]">add</span>
              </button>
            </div>
          </section>
        </div>

        <div v-else class="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span class="material-symbols-outlined mb-4 text-6xl text-emerald-200">shopping_cart</span>
          <h3 class="text-xl font-bold text-gray-900">Your cart is empty</h3>
          <p class="mt-2 text-sm text-gray-500">Add fresh groceries to see them here.</p>
          <button
            type="button"
            class="mt-6 rounded-xl bg-[#006c49] px-5 py-3 text-sm font-bold text-white transition active:scale-95"
            @click="emit('close')"
          >
            Continue Shopping
          </button>
        </div>

        <footer v-if="items.length" class="border-t border-emerald-100 bg-white p-5">
          <div class="mb-4 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">Subtotal</span>
            <span class="text-2xl font-bold text-gray-900">{{ formatPrice(subtotal) }}</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <RouterLink
              :to="{ name: 'Cart' }"
              class="rounded-xl border-2 border-[#006c49] px-4 py-3 text-center text-sm font-bold text-[#006c49] transition hover:bg-emerald-50"
              @click="emit('close')"
            >
              View Cart
            </RouterLink>
            <RouterLink
              :to="{ name: 'Checkout' }"
              class="rounded-xl bg-[#006c49] px-4 py-3 text-center text-sm font-bold text-white shadow-[0_10px_30px_rgba(16,185,129,0.2)] transition active:scale-95"
              @click="emit('close')"
            >
              Checkout
            </RouterLink>
          </div>
          <p class="mt-3 text-center text-[11px] text-gray-500">Shipping and taxes calculated at checkout</p>
        </footer>
      </aside>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';

interface CartDrawerItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
}

const props = defineProps<{
  open: boolean;
  items: CartDrawerItem[];
}>();

const emit = defineEmits<{
  close: [];
  'update:items': [items: CartDrawerItem[]];
}>();

const totalQuantity = computed(() => props.items.reduce((total, item) => total + item.quantity, 0));
const subtotal = computed(() => props.items.reduce((total, item) => total + item.price * item.quantity, 0));

watch(
  () => props.open,
  (isOpen) => {
    document.body.classList.toggle('overflow-hidden', isOpen);
  },
  { immediate: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      window.addEventListener('keydown', closeOnEscape);
      return;
    }

    window.removeEventListener('keydown', closeOnEscape);
  },
);

onBeforeUnmount(() => {
  document.body.classList.remove('overflow-hidden');
  window.removeEventListener('keydown', closeOnEscape);
});

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close');
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function updateItemQuantity(itemId: number, nextQuantity: number) {
  if (nextQuantity < 1) {
    removeItem(itemId);
    return;
  }

  emit(
    'update:items',
    props.items.map((item) => (item.id === itemId ? { ...item, quantity: nextQuantity } : item)),
  );
}

function increaseQuantity(itemId: number) {
  const item = props.items.find((cartItem) => cartItem.id === itemId);

  if (item) {
    updateItemQuantity(itemId, item.quantity + 1);
  }
}

function decreaseQuantity(itemId: number) {
  const item = props.items.find((cartItem) => cartItem.id === itemId);

  if (item) {
    updateItemQuantity(itemId, item.quantity - 1);
  }
}

function removeItem(itemId: number) {
  emit(
    'update:items',
    props.items.filter((item) => item.id !== itemId),
  );
}

function addRecommendedItem() {
  const recommendedItem: CartDrawerItem = {
    id: 9,
    name: 'Organic Strawberries',
    unit: '250g Punnet',
    price: 39900,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAtK0mVBQDvF9jqs-pIT0v-z5jG1kzt8PQ4DFzeSLLd1YuMvoQoL9MZgp2UXpENR9NHuYOdGsUzCYaJlhyukwkw3tRvzd4M2y8HmIa9fanOzsjP40eK2vLpe3AiU3pOdqZbd4TWRJAKfL9tjnyeU8mVV-EDC5OE7JeElbA2McZ9fuF2ijzy6PEXIo0hIoEYsvdoqRbfhwcaUJLnRqJuMePhUtPwUT_Q9CYufFSYJ-jBTB1pY1QogTPI1cNbraiyENwOhni3x6NF4S1R',
  };
  const existingItem = props.items.find((item) => item.id === recommendedItem.id);

  if (existingItem) {
    updateItemQuantity(existingItem.id, existingItem.quantity + 1);
    return;
  }

  emit('update:items', [...props.items, recommendedItem]);
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
}
</script>

<style scoped>
.cart-fade-enter-active,
.cart-fade-leave-active,
.cart-slide-enter-active,
.cart-slide-leave-active {
  transition: all 0.25s ease;
}

.cart-fade-enter-from,
.cart-fade-leave-to {
  opacity: 0;
}

.cart-slide-enter-from,
.cart-slide-leave-to {
  transform: translateX(100%);
}

.style-filled {
  font-variation-settings: 'FILL' 1;
}
</style>
