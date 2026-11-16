<template>
  <footer class="mt-auto bg-[#073b2c] text-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-16 lg:py-14">
      <section aria-labelledby="footer-brand">
        <a
          href="/"
          class="mb-4 inline-flex items-center gap-3"
          aria-label="VNC Mart - về trang chủ"
        >
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6ffbbe] text-[#073b2c]">
            <svg
              aria-hidden="true"
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M12 21c-4.5-2.7-7-6.1-7-10.2V5l7-2 7 2v5.8C19 14.9 16.5 18.3 12 21Z" />
              <path d="M8.5 12.2 11 14.5l4.8-5.2" />
            </svg>
          </span>
          <span id="footer-brand" class="text-2xl font-bold tracking-tight">VNC Mart</span>
        </a>
        <p class="max-w-sm text-sm leading-6 text-emerald-100/75">
          Thực phẩm tươi ngon mỗi ngày, được tuyển chọn kỹ lưỡng và giao tận nhà.
        </p>
        <div class="mt-6 flex items-center gap-3">
          <a
            :href="facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook VNC Mart (mở tab mới)"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#1877f2]"
          >
            <svg aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z"
              />
            </svg>
          </a>
          <a
            :href="zaloUrl"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Zalo VNC Mart (mở tab mới)"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#1683ff]"
          >
            <svg aria-hidden="true" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 3.2c-5.1 0-9.2 3.6-9.2 8.1 0 2.4 1.2 4.6 3.2 6.1l-.8 3.4 4-1.9c.9.3 1.8.4 2.8.4 5.1 0 9.2-3.6 9.2-8.1S17.1 3.2 12 3.2Zm-4 10.4 4.3-5.1H8.4V6.7h7.2v1.5l-4.3 5.1h4.4v1.8H8v-1.5Z"
              />
            </svg>
          </a>
        </div>
      </section>

      <section aria-labelledby="footer-branches">
        <h2 id="footer-branches" class="mb-4 text-base font-bold">Địa chỉ các cơ sở</h2>
        <ul v-if="branches.length" class="space-y-4">
          <li v-for="branch in branches" :key="branch.name" class="flex gap-3 text-sm">
            <svg
              aria-hidden="true"
              class="mt-0.5 h-5 w-5 shrink-0 text-[#6ffbbe]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <div>
              <p class="font-semibold text-white">{{ branch.name }}</p>
              <p class="mt-1 leading-6 text-emerald-100/75">{{ branch.address }}</p>
              <a
                v-if="branch.phone"
                :href="`tel:${branch.phone.replace(/[^\d+]/g, '')}`"
                class="mt-1 inline-block text-emerald-100/75 transition hover:text-[#6ffbbe]"
              >
                {{ branch.phone }}
              </a>
            </div>
          </li>
        </ul>
        <p v-else class="text-sm leading-6 text-emerald-100/60">
          Địa chỉ các cơ sở sẽ được cập nhật.
        </p>
      </section>

      <section aria-labelledby="footer-contact">
        <h2 id="footer-contact" class="mb-4 text-base font-bold">Liên hệ với chúng tôi</h2>
        <div class="space-y-4 text-sm">
          <div class="flex items-start gap-3">
            <svg
              aria-hidden="true"
              class="mt-0.5 h-5 w-5 shrink-0 text-[#6ffbbe]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M5 4h3l2 5-2 1.5a15 15 0 0 0 5.5 5.5L15 14l5 2v3c0 1.1-.9 2-2 2C9.7 21 3 14.3 3 6c0-1.1.9-2 2-2Z" />
            </svg>
            <a
              v-if="phone"
              :href="`tel:${phone.replace(/[^\d+]/g, '')}`"
              class="text-emerald-100/80 transition hover:text-[#6ffbbe]"
            >
              {{ phone }}
            </a>
            <span v-else class="text-emerald-100/60">Vui lòng cập nhật số điện thoại</span>
          </div>

          <div v-if="email" class="flex items-start gap-3">
            <svg
              aria-hidden="true"
              class="mt-0.5 h-5 w-5 shrink-0 text-[#6ffbbe]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            <a
              :href="`mailto:${email}`"
              class="text-emerald-100/80 transition hover:text-[#6ffbbe]"
            >
              {{ email }}
            </a>
          </div>

          <p class="pt-1 text-xs leading-5 text-emerald-100/60">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn mỗi ngày.
          </p>
        </div>
      </section>
    </div>

    <div class="border-t border-white/10">
      <p class="mx-auto max-w-7xl px-5 py-4 text-center text-xs text-emerald-100/55 sm:px-8">
        © {{ currentYear }} VNC Mart. Bảo lưu mọi quyền.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Branch {
  name: string
  address: string
  phone?: string
}

withDefaults(
  defineProps<{
    branches?: Branch[]
    phone?: string
    email?: string
    facebookUrl?: string
    zaloUrl?: string
  }>(),
  {
    branches: () => [],
    phone: '',
    email: '',
    facebookUrl: 'https://www.facebook.com/',
    zaloUrl: 'https://zalo.me/',
  },
)

const currentYear = new Date().getFullYear()
</script>