import { api } from './axios';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  token_type: string;
}

export const authService = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', { name, email, password });
    const data = response.data?.data || response.data;
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data?.data || response.data;
    return data;
  },

  getMe: async (token: string): Promise<AuthUser> => {
    const response = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data?.data || response.data;
    return data;
  },
};
