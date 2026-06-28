// src/services/api.ts
import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse, ErrorResponse } from '@/types/api';

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
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: Chuẩn hóa dữ liệu trả về và bắt lỗi tập trung (Mục 3, 12)
apiClient.interceptors.response.use(
  (response) => {
    // Backend trả về dạng ApiResponse<T>, chúng ta bóc tách lấy .data để dùng luôn
    const apiData = response.data as ApiResponse<any>;
    
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
      const errorData = error.response.data as ErrorResponse;
      
      // Lấy câu thông báo lỗi tối ưu nhất từ backend đưa xuống
      const friendlyMessage = errorData?.message || errorData?.detail || 'Lỗi hệ thống, vui lòng thử lại.';

      switch (status) {
        case 401:
          // Hết hạn token hoặc chưa đăng nhập -> Xóa session, điều hướng về login
          localStorage.removeItem('vnc_auth_token');
          // Tùy chỉnh logic redirect về trang login phù hợp (Customer/Admin) ở phần router sau
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          window.location.href = '/login';
          break;
          
        case 403:
          // Không có quyền truy cập vào tính năng này (ví dụ customer vào trang admin)
          alert('Bạn không có quyền thực hiện hành động này.');
          break;
          
        case 400:
        case 404:
        case 500:
          // Các lỗi nghiệp vụ khác: Hiện thông báo thông qua alert (sau này sẽ kết nối với Toast/Modal từ Stitch)
          // Bạn có thể kích hoạt một global event hoặc pinia store ở đây để bật popup lỗi
          console.error(`[API Error ${status}]:`, friendlyMessage);
          break;
          
        default:
          console.error('Unhandled API Error:', error);
      }
      
      return Promise.reject(friendlyMessage);
    }
    
    // Trường hợp mất kết nối mạng hoặc server sập không phản hồi
    return Promise.reject('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại mạng.');
  }
);

export default apiClient;