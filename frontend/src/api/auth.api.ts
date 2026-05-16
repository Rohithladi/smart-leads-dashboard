import { http } from "./http";
import type { ApiSuccess } from "../types/api.types";
import type { AuthResponse, AuthUser } from "../types/auth.types";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await http.post<ApiSuccess<AuthResponse>>("/auth/register", payload);
    return response.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await http.post<ApiSuccess<AuthResponse>>("/auth/login", payload);
    return response.data.data;
  },

  async me(): Promise<AuthUser> {
    const response = await http.get<ApiSuccess<{ user: AuthUser }>>("/auth/me");
    return response.data.data.user;
  }
};
