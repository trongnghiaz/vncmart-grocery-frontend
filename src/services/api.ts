import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api';

const DEFAULT_ERROR_MESSAGE = 'Lỗi hệ thống, vui lòng thử lại.';
const NETWORK_ERROR_MESSAGE = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.';
const AUTH_TOKEN_KEY = 'vnc_auth_token';

function getErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return DEFAULT_ERROR_MESSAGE;
  }

  const errorPayload = payload as Partial<{
    errorMessage: string;
    message: string;
    detail: string;
    title: string;
  }>;

  return (
    errorPayload.errorMessage ||
    errorPayload.message ||
    errorPayload.detail ||
    errorPayload.title ||
    DEFAULT_ERROR_MESSAGE
  );
}

function redirectToLogin() {
  const currentPath = `${window.location.pathname}${window.location.search}`;
  const loginPath = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
  const redirectParam = encodeURIComponent(currentPath);

  window.location.assign(`${loginPath}?redirect=${redirectParam}`);
}

const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5067/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const apiData = response.data;

    if (apiData && apiData.isSuccess === false) {
      return Promise.reject(new Error(apiData.errorMessage || DEFAULT_ERROR_MESSAGE));
    }

    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const friendlyMessage = getErrorMessage(error.response.data);

      if (status === 401) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('vnc_user_session');
        redirectToLogin();
      }

      return Promise.reject(new Error(friendlyMessage));
    }

    return Promise.reject(new Error(NETWORK_ERROR_MESSAGE));
  }
);

export default apiClient;
