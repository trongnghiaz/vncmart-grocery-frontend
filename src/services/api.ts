// src/services/api.ts
import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types/api';

const DEFAULT_ERROR_MESSAGE = 'Lỗi hệ thống, vui lòng thử lại.';
const NETWORK_ERROR_MESSAGE = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.';

function getErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return DEFAULT_ERROR_MESSAGE;
  }

  const errorPayload = payload as Partial<{ message: string; detail: string; title: string }>;

  return errorPayload.message || errorPayload.detail || errorPayload.title || DEFAULT_ERROR_MESSAGE;
}

// 1. Khởi tạo Axios Instance với Base URL cấu hình từ môi trường (.env)
const apiClient = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:5067/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây track timeout
});

// 2. Request Interceptor: Tự động đính kèm Bearer Token vào Header nếu có
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Tạm thời lấy từ localStorage, sau này chúng ta sẽ tích hợp với Pinia store
    const token = localStorage.getItem('vnc_auth_token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Chuẩn hóa dữ liệu trả về và bắt lỗi tập trung (Mục 3, 12)
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // Backend trả về dạng ApiResponse<T>; chặn sớm các lỗi nghiệp vụ trả về HTTP 200.
    const apiData = response.data;
    
    if (apiData && apiData.isSuccess === false) {
      // Xử lý trường hợp HTTP 200 nhưng business logic báo lỗi (isSuccess = false)
      return Promise.reject(apiData.errorMessage || 'Đã có lỗi xảy ra từ hệ thống.');
    }
    
    return response;
  },
  (error: AxiosError) => {
    // Kiểm tra nếu lỗi phản hồi từ Server (Shape: ErrorResponse ở Mục 3)
    if (error.response) {
      const status = error.response.status;
      const friendlyMessage = getErrorMessage(error.response.data);

      switch (status) {
        case 401:
          // Hết hạn token hoặc chưa đăng nhập -> Xóa session, điều hướng về login
          localStorage.removeItem('vnc_auth_token');
          break;
          
        case 403:
          console.warn(`[API Error ${status}]:`, friendlyMessage);
          break;
          
        case 400:
        case 404:
        case 500:
          console.error(`[API Error ${status}]:`, friendlyMessage);
          break;
          
        default:
          console.error('Unhandled API Error:', error);
      }
      
      return Promise.reject(friendlyMessage);
    }
    
    // Trường hợp mất kết nối mạng hoặc server sập không phản hồi
    return Promise.reject(NETWORK_ERROR_MESSAGE);
  }
);

export default apiClient;
