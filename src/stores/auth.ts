// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { type AuthResultDto } from '@/types/api';
import { authService } from '../services/auth.service';

export const useAuthStore = defineStore('auth', () => {
  // 1. TRẠNG THÁI (STATE)
  // Khởi tạo user từ localStorage nếu có để giữ phiên đăng nhập khi F5 trang
  const user = ref<AuthResultDto | null>((() => {
    const savedUser = localStorage.getItem('vnc_user_session');
    return savedUser ? JSON.parse(savedUser) : null;
  })());

  const isLoading = ref<boolean>(false);
  const authError = ref<string | null>(null);

  // 2. TRẠNG THÁI SUY RA (GETTERS)
  const isAuthenticated = computed(() => user.value !== null);
  const token = computed(() => user.value?.token || null);
  const isAdmin = computed(() => user.value?.isStaff === true && user.value?.role === 'Admin');
  const currentUser = computed(() => user.value);

  // 3. HÀNH ĐỘNG (ACTIONS)
 
  /**
   * Lưu thông tin đăng nhập thành công vào Store và LocalStorage (Mục 11)
   */
  function setSession(authData: AuthResultDto) {
    user.value = authData;
    authError.value = null;
    
    // Lưu token riêng cho Axios Interceptor và lưu cả object user cho UI
    localStorage.setItem('vnc_auth_token', authData.token);
    localStorage.setItem('vnc_user_session', JSON.stringify(authData));
  }

  /**
   * Đăng xuất: Xóa sạch trạng thái toàn cục và bộ nhớ đệm (Mục 12)
   */
  function logout() {
    user.value = null;
    authError.value = null;
    localStorage.removeItem('vnc_auth_token');
    localStorage.removeItem('vnc_user_session');
  }

  /**
   * Đặt thông báo lỗi khi đăng nhập thất bại
   */
  function setAuthError(message: string) {
    authError.value = message;
  }
    async function handleLoginWithPassword(phone: string, password: string) {
    isLoading.value = true;
    authError.value = null;
    try {
      const authResult = await authService.loginWithPassword(phone, password);
      setSession(authResult); // Lưu session vào store và localStorage nếu thành công
      return authResult;
    } catch (error: any) {
      // error ở đây chính là câu thông báo thân thiện đã được interceptor xử lý và reject về
      setAuthError(error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function handleLoginWithOtp(phone: string, otpCode: string) {
    isLoading.value = true;
    authError.value = null;
    try {
      const authResult = await authService.loginWithOtp(phone, otpCode);
      setSession(authResult);
      return authResult;
    } catch (error: any) {
      setAuthError(error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  return {
    user,
    isLoading,
    authError,
    isAuthenticated,
    token,
    isAdmin,
    currentUser,
    setSession,
    logout,
    setAuthError,
    handleLoginWithPassword,
    handleLoginWithOtp
  };
});