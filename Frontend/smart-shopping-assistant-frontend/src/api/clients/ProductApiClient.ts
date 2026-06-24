import { http } from "../base/http";
import type { ProductInput, ProductModel } from "../models/ProductModel";
import { toProduct, type Product } from "../../components/shared/types/Product";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const data = await http.get<ProductModel[]>("/products");
    return data.map(toProduct);
  },
  getById: async (id: number): Promise<Product> => {
    return toProduct(await http.get<ProductModel>(`/products/${id}`));
  },
  getByIds: async (ids: number[]): Promise<Product[]> => {
    const data = await http.post<ProductModel[]>("/products/batch", ids);
    return data.map(toProduct);
  },
  search: async (query: string): Promise<Product[]> => {
    const data = await http.get<ProductModel[]>(`/products?name=${encodeURIComponent(query)}`);
    return data.map(toProduct);
  },
  getRelated: async (id: number): Promise<Product[]> => {
    const data = await http.get<ProductModel[]>(`/products/${id}/related`);
    return data.map(toProduct);
  },
  create: async (data: ProductInput): Promise<Product> => {
    return toProduct(await http.post<ProductModel>("/products", data));
  },
  update: async (id: number, data: ProductInput): Promise<Product> => {
    return toProduct(await http.put<ProductModel>(`/products/${id}`, data));
  },
  remove: (id: number) => http.remove<void>(`/products/${id}`),
};
