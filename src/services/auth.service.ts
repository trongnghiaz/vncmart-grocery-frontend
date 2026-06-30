// src/services/auth.service.ts
import apiClient from './api';
import { type ApiResponse, type AuthResultDto } from '@/types/api';

export const authService = {
  /**
   * Phương thức 1: Đăng nhập bằng Số điện thoại + Mật khẩu (Mục 4)
   */
  async loginWithPassword(phone: string, password: string): Promise<AuthResultDto> {
    // Gửi request POST lên endpoint tương ứng của .NET Core
    const response = await apiClient.post<ApiResponse<AuthResultDto>>('/auth/login-password', {
      phone,
      password
    });
    
    // axios interceptor của mình đã bóc tách dữ liệu, ở đây ta chỉ cần trả về .data
    return response.data.data;
  },

  /**
   * Phương thức 2A: Yêu cầu hệ thống gửi mã OTP về Số điện thoại (Mục 4)
   * Hàm này sẽ kích hoạt tổng đài gửi SMS hoặc trả về trạng thái để UI bật countdown timer
   */
  async requestOtp(phone: string): Promise<boolean> {
    const response = await apiClient.post<ApiResponse<string>>('/auth/request-otp', { phone });
    return response.data.isSuccess;
  },

  /**
   * Phương thức 2B: Xác thực mã OTP để đăng nhập hệ thống (Mục 4)
   */
  async loginWithOtp(phone: string, otpCode: string): Promise<AuthResultDto> {
    const response = await apiClient.post<ApiResponse<AuthResultDto>>('/auth/verify-otp', {
      phone,
      otpCode
    });
    return response.data.data;
  }
};