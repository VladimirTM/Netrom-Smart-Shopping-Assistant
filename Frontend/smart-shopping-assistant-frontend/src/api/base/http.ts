import axios from "axios";

export const TOKEN_KEY = "auth_token";

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) {
      onUnauthorized?.();
    }
    const data = error.response?.data;
    let message: string;
    if (typeof data === "string" && data !== "") {
      message = data;
    } else if (data && typeof data === "object") {
      const errors = data.errors as Record<string, string[]> | undefined;
      message =
        data.detail ??
        data.title ??
        (errors ? Object.values(errors).flat()[0] : null) ??
        error.message ??
        "Request failed";
    } else {
      message = error.message || "Request failed";
    }
    return Promise.reject(new Error(message));
  },
);

export const http = {
  get: async <T>(path: string): Promise<T> => {
    const response = await api.get<T>(path);
    return response.data;
  },
  post: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await api.post<T>(path, body);
    return response.data;
  },
  put: async <T>(path: string, body: unknown): Promise<T> => {
    const response = await api.put<T>(path, body);
    return response.data;
  },
  remove: async <T>(path: string): Promise<T> => {
    const response = await api.delete<T>(path);
    return response.data;
  },
};
