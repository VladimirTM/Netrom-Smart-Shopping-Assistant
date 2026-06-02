import { http } from "../base/http";
import type { ProductInput, ProductModel } from "../models/ProductModel";
import { toProduct, type Product } from "../../components/shared/types/Product";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const data = await http.get<ProductModel[]>("/products");
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
