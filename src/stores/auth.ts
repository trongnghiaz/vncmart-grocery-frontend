import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthResultDto, RegisterRequest } from '@/types/api';
import { authService } from '@/services/auth.service';

const AUTH_TOKEN_KEY = 'vnc_auth_token';
const AUTH_SESSION_KEY = 'vnc_user_session';

function isAuthResultDto(value: unknown): value is AuthResultDto {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Partial<AuthResultDto>;

  return (
    typeof session.id === 'number' &&
    typeof session.account === 'string' &&
    typeof session.fullName === 'string' &&
    typeof session.role === 'string' &&
    typeof session.isStaff === 'boolean' &&
    typeof session.token === 'string' &&
    session.token.length > 0
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Lỗi hệ thống, vui lòng thử lại.';
}

function loadStoredSession(): AuthResultDto | null {
  const savedUser = localStorage.getItem(AUTH_SESSION_KEY);

  if (!savedUser) {
    return null;
  }

  try {
    const parsedSession: unknown = JSON.parse(savedUser);

    if (isAuthResultDto(parsedSession)) {
      localStorage.setItem(AUTH_TOKEN_KEY, parsedSession.token);
      return parsedSession;
    }
  } catch {
    // Invalid cached auth data should never prevent the app from booting.
  }

  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
  return null;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthResultDto | null>(loadStoredSession());
  const isLoading = ref(false);
  const authError = ref<string | null>(null);

  const isAuthenticated = computed(() => user.value !== null);
  const token = computed(() => user.value?.token ?? null);
  const isStaff = computed(() => user.value?.isStaff === true);
  const isAdmin = computed(() => user.value?.isStaff === true && user.value.role === 'Admin');
  const currentUser = computed(() => user.value);

  function setSession(authData: AuthResultDto) {
    user.value = authData;
    authError.value = null;
    localStorage.setItem(AUTH_TOKEN_KEY, authData.token);
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authData));
  }

  function clearSession() {
    user.value = null;
    authError.value = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_SESSION_KEY);
  }

  function setAuthError(message: string | null) {
    authError.value = message;
  }

  async function runAuthAction(action: () => Promise<AuthResultDto>) {
    isLoading.value = true;
    authError.value = null;

    try {
      const authResult = await action();
      setSession(authResult);
      return authResult;
    } catch (error) {
      const message = getErrorMessage(error);
      setAuthError(message);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function loginCustomer(account: string, password: string) {
    return runAuthAction(() => authService.loginCustomer(account.trim(), password));
  }

  function loginStaff(account: string, password: string) {
    return runAuthAction(() => authService.loginStaff(account.trim(), password));
  }

  async function registerCustomer(payload: RegisterRequest) {
    isLoading.value = true;
    authError.value = null;

    try {
      return await authService.registerCustomer(payload);
    } catch (error) {
      const message = getErrorMessage(error);
      setAuthError(message);
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function loginWithOtp(phone: string, otpCode: string) {
    return runAuthAction(() => authService.loginWithOtp(phone.trim(), otpCode.trim()));
  }

  return {
    user,
    isLoading,
    authError,
    isAuthenticated,
    token,
    isStaff,
    isAdmin,
    currentUser,
    setSession,
    logout: clearSession,
    setAuthError,
    loginCustomer,
    loginStaff,
    registerCustomer,
    loginWithOtp,
  };
});
