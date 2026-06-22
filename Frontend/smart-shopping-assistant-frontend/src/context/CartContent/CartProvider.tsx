import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Cart } from "../../components/shared/types/Cart";
import { cartApi } from "../../api/clients/CartApiClient";
import { CartContext } from "./cart-context";
import { useAuth } from "../AuthContext/auth-context";

function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  const loadCart = useCallback(() => {
    if (!isAuthenticated) return Promise.resolve();
    return cartApi
      .getCart()
      .then((data) => { setCart(data); setCartError(null); })
      .catch((err: Error) => { setCartError(err.message ?? "Failed to load cart."); });
  }, [isAuthenticated]);

  const addItem = useCallback(async (productId: number, quantity: number) => {
    try {
      await cartApi.addItem({ productId, quantity });
      await loadCart();
    } catch (err) {
      await loadCart();
      throw err;
    }
  }, [loadCart]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    try {
      await cartApi.updateItem(cartItemId, { quantity });
      await loadCart();
    } catch (err) {
      await loadCart();
      throw err;
    }
  }, [loadCart]);

  const removeProduct = useCallback(async (cartItemId: number) => {
    try {
      await cartApi.removeItem(cartItemId);
      await loadCart();
    } catch (err) {
      await loadCart();
      throw err;
    }
  }, [loadCart]);

  const openCart = useCallback(() => setOpen(true), []);
  const closeCart = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
      setCartError(null);
    }
  }, [isAuthenticated, loadCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        open,
        cartError,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeProduct,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
