import apiClient from './api';
import type { ApiResponse, AuthResultDto, LoginRequest, RegisterRequest } from '@/types/api';

function unwrapData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export const authService = {
  async registerCustomer(payload: RegisterRequest): Promise<boolean> {
    const response = await apiClient.post<ApiResponse<boolean>>('/Auth/customer/register', payload);
    return unwrapData(response);
  },

  async loginCustomer(account: string, password: string): Promise<AuthResultDto> {
    const payload: LoginRequest = { account, password };
    const response = await apiClient.post<ApiResponse<AuthResultDto>>('/Auth/customer/login', payload);
    return unwrapData(response);
  },

  async loginStaff(account: string, password: string): Promise<AuthResultDto> {
    const payload: LoginRequest = { account, password };
    const response = await apiClient.post<ApiResponse<AuthResultDto>>('/Auth/staff/login', payload);
    return unwrapData(response);
  },

  async requestOtp(phone: string): Promise<boolean> {
    void phone;
    throw new Error('Backend hiện chưa hỗ trợ đăng nhập bằng OTP.');
  },

  async loginWithOtp(phone: string, otpCode: string): Promise<AuthResultDto> {
    void phone;
    void otpCode;
    throw new Error('Backend hiện chưa hỗ trợ đăng nhập bằng OTP.');
  },
};
