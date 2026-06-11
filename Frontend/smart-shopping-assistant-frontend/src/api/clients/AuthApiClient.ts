import { http } from "../base/http";
import type { AuthUser } from "../../context/AuthContext/auth-context";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  role: string;
  email: string;
  userId: number;
}

interface UserDto {
  id: number;
  email: string;
  role: string;
  createdAt: string;
}

function toAuthUser(dto: UserDto): AuthUser {
  return {
    userId: dto.id,
    email: dto.email,
    role: dto.role as "user" | "admin",
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<{ token: string; user: AuthUser }> => {
    const res = await http.post<AuthResponse>("/auth/login", data);
    return {
      token: res.token,
      user: { userId: res.userId, email: res.email, role: res.role as "user" | "admin" },
    };
  },

  register: async (data: RegisterRequest): Promise<{ token: string; user: AuthUser }> => {
    const res = await http.post<AuthResponse>("/auth/register", data);
    return {
      token: res.token,
      user: { userId: res.userId, email: res.email, role: res.role as "user" | "admin" },
    };
  },

  me: async (): Promise<AuthUser> => {
    const dto = await http.get<UserDto>("/auth/me");
    return toAuthUser(dto);
  },
};
