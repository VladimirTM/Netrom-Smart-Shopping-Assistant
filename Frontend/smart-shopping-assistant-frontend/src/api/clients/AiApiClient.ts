import { http } from "../base/http";
import { toProduct, type Product } from "../../components/shared/types/Product";
import type { ProductModel } from "../models/ProductModel";

export const aiApi = {
  semanticSearch: async (query: string): Promise<Product[]> => {
    const data = await http.post<ProductModel[]>("/ai/search", { query });
    return data.map(toProduct);
  },
};
