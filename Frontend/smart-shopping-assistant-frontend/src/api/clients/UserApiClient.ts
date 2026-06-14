import { http } from "../base/http";

export interface UserProfile {
  id: number;
  email: string;
  role: string;
  displayName: string | null;
  createdAt: string;
}

export const userApi = {
  getProfile: (): Promise<UserProfile> => http.get<UserProfile>("/auth/me"),

  updateProfile: (displayName: string | null): Promise<UserProfile> =>
    http.put<UserProfile>("/auth/me", { displayName }),

  changePassword: (currentPassword: string, newPassword: string): Promise<void> =>
    http.put<void>("/auth/me/password", { currentPassword, newPassword }),
};
