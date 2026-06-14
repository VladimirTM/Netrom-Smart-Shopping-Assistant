import { createContext, useContext } from "react";
import type { Cart } from "../../components/shared/types/Cart";

export interface CartContextValue {
  cart: Cart | null;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeProduct: (cartItemId: number) => Promise<void>;
  refreshCart: () => Promise<void> | void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
