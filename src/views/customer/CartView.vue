<template>
  <div class="min-h-[716px] py-4 sm:py-8">
    <div class="flex flex-col gap-6 md:flex-row lg:gap-8">
      <section class="flex-1 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Your Shopping Cart</h1>
            <p class="mt-1 text-sm font-medium text-gray-500">{{ itemCountLabel }}</p>
          </div>
          <button
            v-if="cartItems.length"
            type="button"
            class="hidden rounded-xl px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 sm:inline-flex"
            @click="clearCart"
          >
            Clear cart
          </button>
        </div>

        <div v-if="cartItems.length" class="space-y-4">
          <article
            v-for="item in cartItems"
            :key="item.id"
            class="group flex flex-col gap-4 rounded-xl border border-emerald-100/80 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center"
          >
            <div class="h-28 w-full overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24 sm:shrink-0">
              <img class="h-full w-full object-cover" :src="item.image" :alt="item.name" />
            </div>

            <div class="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div class="min-w-0">
                <h2 class="truncate text-xl font-bold text-gray-900">{{ item.name }}</h2>
                <p class="text-sm font-medium text-gray-500">{{ item.unit }}</p>
                <p class="mt-1 text-base font-bold text-[#006c49]">{{ formatPrice(item.price) }}</p>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:justify-end md:gap-6">
                <div class="flex items-center rounded-full border border-emerald-100 bg-gray-50 px-1 py-1">
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-full text-[#006c49] transition hover:bg-white"
                    :aria-label="`Decrease ${item.name}`"
                    @click="decreaseQuantity(item.id)"
                  >
                    <span class="material-symbols-outlined text-[20px]">remove</span>
                  </button>
                  <span class="w-10 text-center text-sm font-bold text-gray-900">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-full text-[#006c49] transition hover:bg-white"
                    :aria-label="`Increase ${item.name}`"
                    @click="increaseQuantity(item.id)"
                  >
                    <span class="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>

                <div class="min-w-[100px] text-right">
                  <p class="mb-1 text-sm font-semibold text-gray-500">Total</p>
                  <p class="text-xl font-bold text-gray-900">{{ formatPrice(item.price * item.quantity) }}</p>
                </div>

                <button
                  type="button"
                  class="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  :aria-label="`Remove ${item.name}`"
                  @click="removeItem(item.id)"
                >
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </article>

          <div class="border-t border-emerald-100 pt-4">
            <RouterLink
              :to="{ name: 'Home' }"
              class="inline-flex items-center gap-1 text-sm font-bold text-[#006c49] transition hover:underline"
            >
              <span class="material-symbols-outlined text-[18px]">arrow_back</span>
              Continue Shopping
            </RouterLink>
          </div>
        </div>

        <div v-else class="rounded-2xl border border-emerald-100 bg-white px-6 py-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <span class="material-symbols-outlined mb-4 text-6xl text-emerald-200">shopping_cart</span>
          <h2 class="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p class="mt-2 text-sm text-gray-500">Find something fresh and add it to your cart.</p>
          <RouterLink
            :to="{ name: 'Home' }"
            class="mt-6 inline-flex rounded-xl bg-[#006c49] px-5 py-3 text-sm font-bold text-white transition active:scale-95"
          >
            Continue Shopping
          </RouterLink>
        </div>
      </section>

      <aside class="md:w-96">
        <div class="sticky top-24 rounded-xl border border-emerald-100/80 bg-white p-6 shadow-[0_10px_30px_rgba(16,185,129,0.08)]">
          <h2 class="mb-4 text-2xl font-bold text-gray-900">Order Summary</h2>

          <div class="mb-8 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-base text-gray-600">Subtotal</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base text-gray-600">Estimated Shipping</span>
              <span class="font-semibold text-[#006c49]">{{ formatPrice(shippingFee) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-base text-gray-600">Tax (VAT 8%)</span>
              <span class="font-semibold text-gray-900">{{ formatPrice(vat) }}</span>
            </div>
            <div class="h-px bg-emerald-100" />
            <div class="flex items-end justify-between">
              <span class="text-xl font-bold text-gray-900">Total</span>
              <span class="text-right text-[28px] font-extrabold text-[#006c49]">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <RouterLink
            :to="{ name: 'Checkout' }"
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] py-4 text-sm font-bold text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition hover:brightness-105 active:scale-[0.98]"
            :class="{ 'pointer-events-none opacity-50': !cartItems.length }"
          >
            Proceed to Checkout
            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
          </RouterLink>

          <div class="flex items-center justify-center gap-2 py-3">
            <span class="material-symbols-outlined text-[16px] text-gray-500">verified_user</span>
            <p class="text-xs font-medium text-gray-500">Secure Checkout Guarantee</p>
          </div>

          <div class="mt-6 rounded-xl bg-gray-50 p-4">
            <p class="mb-2 text-xs font-bold text-gray-600">Have a promo code?</p>
            <form class="flex gap-2" @submit.prevent="applyPromoCode">
              <input
                v-model.trim="promoCode"
                class="min-w-0 flex-1 rounded-lg border border-emerald-100 bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[#006c49]/20"
                placeholder="FRESH2024"
                type="text"
              />
              <button
                type="submit"
                class="rounded-lg border border-[#006c49] px-4 py-2 text-xs font-bold text-[#006c49] transition hover:bg-emerald-50"
              >
                Apply
              </button>
            </form>
            <p v-if="promoMessage" class="mt-2 text-xs font-semibold" :class="promoApplied ? 'text-[#006c49]' : 'text-red-600'">
              {{ promoMessage }}
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface CartItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  image: string;
}

const cartItems = ref<CartItem[]>([
  {
    id: 1,
    name: 'Organic Avocado',
    unit: 'Weight: 500g',
    price: 45000,
    quantity: 2,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA3HXD8BMjrPP-V_Y9X7Xbl2CiXUeWTqbWcjHU7_qu73gBGtRm0xCHWj29k6Zr58iOhJIqKAHUCPxRnxAtZjU6-YN9LMl_YnikiEmSMLDNrNGj6GWml0jmZ3D5BSLLNWS6GxMKfIg7KL6cF7bWh0CWYDLhtqRUL2i7N8mdWfkqFARLmrE37erp-MStedkdRrlPwY79_F0Raco2G0F_d8c0LW2th261ZpXX91N-m2Wr1FhyD-NUFOuOrelbivXHzcdYBzY9b6Mka6_Sw',
  },
  {
    id: 2,
    name: 'Premium Strawberries',
    unit: 'Box: 250g',
    price: 125000,
    quantity: 1,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBfOOBmjNgO4hZajRgTVMCkSffTIDAxOie7oZ1FzGNnyJz_Hwz_2kZ0GLRb59JPwEE0TO8tLos7EP5g5NXbdAp9ravwyx8hJbPlgBRpEITzOjWq1JpBs0xm2yvJqfbq2wxUs6TTrKJkUeZ7a_ZfiHbKVLvxewVi6Fp1BzQfCkIC0-2DrqhMwjy68hQqwpddV3-HxC4kTOZ4A53m22iMoFVgjDjO5314ZrFYzwLrHBqK3eis8kO-b28KrM6DIelLa0sSSsX3bv79cmSK',
  },
  {
    id: 3,
    name: 'Fresh Farm Milk',
    unit: 'Bottle: 1L',
    price: 32000,
    quantity: 3,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuATL-c32uudPDRAPmZIn_DwLBy1vArSdeVOnmyLyLip7v5omVKxFfg1Vy7wkqtg2TYeDVDwR-fnXvqTW7YPiYGSW_VSU-QZ_1Eukjx7SOyt1bYzp_zvWt2cwmEV2rXLwD6NhN_jZs0apic0LvIfzzV1-fixB7FthX4hz-at49WbiZgnBFBwO1cxw3RDjjjQ6YSjWBGa89sCcbdPRQ1_QHh6p-wsiqddWrScHYen0QyVDSNOBepI3rkSMvaJu1c5jhAQMmAKL5bRJ4-m',
  },
]);

const promoCode = ref('');
const promoApplied = ref(false);
const promoMessage = ref('');

const itemCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0));
const itemCountLabel = computed(() => `(${itemCount.value} ${itemCount.value === 1 ? 'item' : 'items'})`);
const subtotal = computed(() => cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0));
const shippingFee = computed(() => (cartItems.value.length ? 0 : 0));
const vat = computed(() => Math.round(subtotal.value * 0.08));
const discount = computed(() => (promoApplied.value ? Math.round(subtotal.value * 0.1) : 0));
const total = computed(() => subtotal.value + shippingFee.value + vat.value - discount.value);

function increaseQuantity(itemId: number) {
  cartItems.value = cartItems.value.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item));
}

function decreaseQuantity(itemId: number) {
  const item = cartItems.value.find((cartItem) => cartItem.id === itemId);

  if (!item) {
    return;
  }

  if (item.quantity <= 1) {
    removeItem(itemId);
    return;
  }

  cartItems.value = cartItems.value.map((cartItem) =>
    cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
  );
}

function removeItem(itemId: number) {
  cartItems.value = cartItems.value.filter((item) => item.id !== itemId);
}

function clearCart() {
  cartItems.value = [];
}

function applyPromoCode() {
  if (promoCode.value.toUpperCase() === 'FRESH2024') {
    promoApplied.value = true;
    promoMessage.value = 'Promo applied: 10% off your subtotal.';
    return;
  }

  promoApplied.value = false;
  promoMessage.value = 'Promo code is not valid.';
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value).replace('₫', 'đ');
}
</script>
