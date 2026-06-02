import axios from "axios";

// instanta axios globala
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  // success
  (response) => response,
  // error
  (error) => {
    const data = error.response?.data;
    const message =
      typeof data === "string" && data !== ""
        ? data
        : error.message || "Request failed";
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
