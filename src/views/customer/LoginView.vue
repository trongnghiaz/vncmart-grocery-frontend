<template>
  <div class="w-full max-w-120 mx-auto my-12 relative">
    <!-- Auth Background Element (Subtle Decoration) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-500/5 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[120px]"></div>
    </div>

    <!-- Auth Card -->
    <div class="auth-card bg-white rounded-2xl overflow-hidden border border-gray-200 p-8 flex flex-col items-center shadow-sm">
      
      <!-- Branding -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-2">
          <span class="material-symbols-outlined text-[#006c49] text-[40px] select-none" style="font-variation-settings: 'FILL' 1;">eco</span>
        </div>
        <h1 class="font-bold text-2xl text-[#006c49] tracking-tight">VNC Mart</h1>
        <p class="text-sm text-gray-500 mt-1">Freshness delivered to your doorstep</p>
      </div>

      <div v-if="supportsOtp && !isStaffLogin" class="w-full flex border-b border-gray-200 mb-6">
        <button 
          type="button"
          @click="loginMode = 'password'"
          :class="['flex-1 py-4 font-semibold text-sm transition-all border-b-2 text-center', loginMode === 'password' ? 'text-[#006c49] border-[#006c49]' : 'text-gray-500 hover:text-[#006c49] border-transparent']"
        >
          Login with Password
        </button>
        <button 
          type="button"
          @click="loginMode = 'otp'"
          :class="['flex-1 py-4 font-semibold text-sm transition-all border-b-2 text-center', loginMode === 'otp' ? 'text-[#006c49] border-[#006c49]' : 'text-gray-500 hover:text-[#006c49] border-transparent']"
        >
          Login with OTP
        </button>
      </div>

      <!-- Khối Hiển Thị Lỗi Global Từ Pinia Auth Store -->
      <div v-if="authStore.authError" class="w-full mb-4 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
        <span class="material-symbols-outlined text-base">error</span>
        <span>{{ authStore.authError }}</span>
      </div>

      <!-- FORM PHƯƠNG THỨC MẬT KHẨU -->
      <form v-if="loginMode === 'password'" @submit.prevent="handleSubmit" class="w-full space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-600 ml-1">{{ accountLabel }}</label>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-4 text-gray-400 select-none">{{ accountIcon }}</span>
            <input 
              v-model="account"
              :type="accountInputType" 
              required
              :placeholder="accountPlaceholder" 
              class="w-full h-12 pl-12 pr-4 bg-gray-50 border-transparent rounded-xl focus:border-[#006c49] focus:bg-white focus:ring-0 transition-colors text-sm text-gray-800"
            />
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center px-1">
            <label class="text-sm font-semibold text-gray-600">Password</label>
            <a class="text-xs font-semibold text-[#006c49] hover:underline underline-offset-2" href="#">Forgot Password?</a>
          </div>
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-4 text-gray-400 select-none">lock</span>
            <input 
              v-model="password"
              :type="isPasswordVisible ? 'text' : 'password'" 
              required
              placeholder="Enter your password" 
              class="w-full h-12 pl-12 pr-12 bg-gray-50 border-transparent rounded-xl focus:border-[#006c49] focus:bg-white focus:ring-0 transition-colors text-sm text-gray-800"
            />
            <button 
              type="button" 
              @click="isPasswordVisible = !isPasswordVisible"
              class="absolute right-4 text-gray-400 hover:text-[#006c49] transition-colors flex items-center"
            >
              <span class="material-symbols-outlined select-none">{{ isPasswordVisible ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>
      </form>

      <!-- FORM PHƯƠNG THỨC MÃ OTP -->
      <form v-else @submit.prevent="handleSubmit" class="w-full space-y-6">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-gray-600 ml-1">Phone Number</label>
          <div class="relative flex items-center gap-2">
            <div class="relative flex-1 flex items-center">
              <span class="material-symbols-outlined absolute left-4 text-gray-400 select-none">call</span>
              <input 
                v-model="account"
                type="tel" 
                required
                placeholder="Enter mobile number" 
                class="w-full h-12 pl-12 pr-4 bg-gray-50 border-transparent rounded-xl focus:border-[#006c49] focus:bg-white focus:ring-0 transition-colors text-sm text-gray-800"
              />
            </div>
            <button 
              type="button"
              @click="handleGetOtp"
              :disabled="isOtpCooldown || !account"
              class="h-12 px-6 bg-emerald-50 text-[#006c49] text-sm font-semibold rounded-xl hover:bg-emerald-100/80 transition-all shrink-0 disabled:opacity-50"
            >
              Send OTP
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center px-1">
            <label class="text-sm font-semibold text-gray-600">Verification Code</label>
            <div class="text-xs font-medium text-gray-400 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">timer</span>
              <span v-if="isOtpCooldown">Resend in {{ cooldownSeconds }}s</span>
              <button v-else type="button" @click="handleGetOtp" class="text-[#006c49] hover:underline font-semibold">Resend Now</button>
            </div>
          </div>
          <!-- 6 Ô Nhập OTP Tách Rời Sử Dụng V-Model Mảng -->
          <div class="grid grid-cols-6 gap-2">
            <input 
              v-for="(digit, index) in otpDigits" 
              :key="index"
              ref="otpInputs"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              @input="handleOtpInput($event, index)"
              @keydown.delete="handleOtpBackspace($event, index)"
              class="w-full h-14 bg-gray-50 border-transparent rounded-xl text-center text-xl font-bold focus:border-[#006c49] focus:bg-white focus:ring-0 transition-all text-gray-800"
            />
          </div>
        </div>
      </form>

      <!-- HÀNH ĐỘNG CHUNG (NÚT LOGIN CHÍNH) -->
      <div class="w-full mt-8 space-y-6">
        <button 
          type="button"
          @click="handleSubmit"
          :disabled="authStore.isLoading"
          class="login-btn-shadow w-full h-14 bg-[#006c49] text-white font-semibold text-lg rounded-xl hover:bg-[#00422b] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <span v-if="authStore.isLoading" class="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
          <span v-else class="flex items-center gap-2">
            Login
            <span class="material-symbols-outlined text-xl">arrow_forward</span>
          </span>
        </button>

        <div class="text-center">
          <p class="text-sm text-gray-500">
            Don't have an account? 
            <a v-if="!isStaffLogin" class="text-sm font-semibold text-[#006c49] hover:underline underline-offset-4 ml-1" href="#">Register</a>
            <span v-else class="text-sm font-semibold text-[#006c49] ml-1">Staff Portal</span>
          </p>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="mt-8 pt-6 border-t border-gray-100 w-full text-center">
        <p class="text-xs text-gray-400">© 2024 VNC Mart. Freshness & Efficiency.</p>
      </div>
    </div>

    <!-- App Icon Grid Background Detail -->
    <div class="mt-6 flex justify-center gap-6 opacity-20 grayscale pointer-events-none select-none text-gray-400">
      <span class="material-symbols-outlined text-[32px]">grocery</span>
      <span class="material-symbols-outlined text-[32px]">egg</span>
      <span class="material-symbols-outlined text-[32px]">nutrition</span>
      <span class="material-symbols-outlined text-[32px]">local_shipping</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth.service';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const supportsOtp = false;

const loginMode = ref<'password' | 'otp'>('password');
const account = ref('');
const password = ref<string>('');
const isPasswordVisible = ref<boolean>(false);

const otpDigits = ref<string[]>(Array(6).fill(''));
const otpInputs = ref<HTMLInputElement[]>([]);

const isOtpCooldown = ref<boolean>(false);
const cooldownSeconds = ref<number>(0);
const otpTimer = ref<number | null>(null);

const isStaffLogin = computed(() => route.name === 'AdminLogin');
const accountLabel = computed(() => (isStaffLogin.value ? 'Staff Email' : 'Phone Number'));
const accountIcon = computed(() => (isStaffLogin.value ? 'mail' : 'call'));
const accountInputType = computed(() => (isStaffLogin.value ? 'email' : 'tel'));
const accountPlaceholder = computed(() =>
  isStaffLogin.value ? 'Enter your staff email' : 'Enter your mobile number',
);

// Xử lý tự động chuyển ô (Focus) khi gõ mã OTP
function handleOtpInput(event: Event, index: number) {
  const element = event.target as HTMLInputElement;
  const val = element.value;
  
  // Chỉ nhận ký tự số
  otpDigits.value[index] = val.replace(/[^0-9]/g, '');

  if (otpDigits.value[index] && index < 5) {
    nextTick(() => {
      otpInputs.value[index + 1]?.focus();
    });
  }
}

// Xử lý bấm Backspace chuyển lùi ô OTP
function handleOtpBackspace(event: Event, index: number) {
  void event;
  // Nếu ô hiện tại đang trống và vị trí > 0, tự động nhảy lùi về ô trước
  if (!otpDigits.value[index] && index > 0) {
    nextTick(() => {
      otpInputs.value[index - 1]?.focus();
    });
  }
}

// Hàm đếm ngược thời gian hồi mã OTP
function startOtpTimer() {
  stopOtpTimer();
  isOtpCooldown.value = true;
  cooldownSeconds.value = 59;
  otpTimer.value = window.setInterval(() => {
    cooldownSeconds.value--;
    if (cooldownSeconds.value <= 0) {
      stopOtpTimer();
    }
  }, 1000);
}

function stopOtpTimer() {
  if (otpTimer.value !== null) {
    window.clearInterval(otpTimer.value);
    otpTimer.value = null;
  }
  isOtpCooldown.value = false;
}

// Gọi API gửi mã OTP ngầm lên Backend
async function handleGetOtp() {
  if (!account.value) {
    authStore.setAuthError('Please enter your phone number first.');
    return;
  }

  try {
    const success = await authService.requestOtp(account.value);
    if (success) {
      startOtpTimer();
    }
  } catch (error) {
    authStore.setAuthError(error instanceof Error ? error.message : 'Failed to send OTP code.');
  }
}

async function handleSubmit() {
  try {
    if (isStaffLogin.value) {
      loginMode.value = 'password';
      await authStore.loginStaff(account.value, password.value);
    } else if (loginMode.value === 'password') {
      await authStore.loginCustomer(account.value, password.value);
    } else {
      const fullOtpCode = otpDigits.value.join('');
      if (fullOtpCode.length < 6) {
        authStore.setAuthError('Please enter the full 6-digit verification code.');
        return;
      }
      await authStore.loginWithOtp(account.value, fullOtpCode);
    }

    const redirectTo =
      typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
        ? route.query.redirect
        : null;

    if (redirectTo) {
      router.push(redirectTo);
    } else if (authStore.isAdmin) {
      router.push({ name: 'AdminDashboard' });
    } else {
      router.push({ name: 'Home' });
    }
  } catch (err) {
    console.error('Authentication process stopped:', err);
  }
}

onBeforeUnmount(stopOtpTimer);
</script>

<style scoped>
.auth-card {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.02);
}
.login-btn-shadow {
  box-shadow: 0px 10px 30px rgba(0, 108, 73, 0.15);
}
</style>
