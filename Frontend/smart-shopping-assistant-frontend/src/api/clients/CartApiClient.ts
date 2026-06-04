import { http } from "../base/http";
import type {
  CartModel,
  CartItemCreateInput,
  CartItemUpdateInput,
  AnalysisResponseModel,
} from "../models/CartModel";
import {
  toCart,
  toAnalysisResponse,
  type Cart,
  type AnalysisResponse,
} from "../../components/shared/types/Cart";

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
  analyzeCart: async (): Promise<AnalysisResponse> => {
    return toAnalysisResponse(await http.post<AnalysisResponseModel>("/cart/analyze", {}));
  },
};
