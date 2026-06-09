import { http } from "../base/http";
import type {
  CartModel,
  CartItemCreateInput,
  CartItemUpdateInput,
} from "../models/CartModel";
import { toCart, type Cart } from "../../components/shared/types/Cart";
import type { AnalysisModel } from "../models/AnalysisModel";
import {
  toAnalysis,
  type Analysis,
} from "../../components/shared/types/Analysis";

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    return toCart(await http.get<CartModel>("/cart"));
  },
  addItem: async (data: CartItemCreateInput): Promise<Cart> => {
    return toCart(await http.post<CartModel>("/cart/items", data));
  },
  updateItem: async (id: number, data: CartItemUpdateInput): Promise<Cart> => {
    return toCart(await http.put<CartModel>(`/cart/items/${id}`, data));
  },
  removeItem: async (id: number): Promise<Cart> => {
    return toCart(await http.remove<CartModel>(`/cart/items/${id}`));
  },
  clearCart: (): Promise<void> => http.remove<void>("/cart"),
  analyze: async (): Promise<Analysis> => {
    return toAnalysis(await http.post<AnalysisModel>("/cart/analyze", {}));
  },
};
