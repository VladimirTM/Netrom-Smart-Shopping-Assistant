import { useEffect, useState, type ReactNode } from "react";
import type { Cart } from "../../components/shared/types/Cart";
import { cartApi } from "../../api/clients/CartApiClient";
import { CartContext } from "./cart-context";
import { useAuth } from "../AuthContext/auth-context";

function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);

  const loadCart = () => {
    if (!isAuthenticated) return Promise.resolve();
    return cartApi.getCart().then(setCart).catch(() => setCart(null));
  };

  async function addItem(productId: number, quantity: number) {
    try {
      await cartApi.addItem({ productId, quantity });
      loadCart();
    } catch (err) {
      loadCart();
      throw err;
    }
  }

  async function updateQuantity(cartItemId: number, quantity: number) {
    try {
      await cartApi.updateItem(cartItemId, { quantity });
      loadCart();
    } catch (err) {
      loadCart();
      throw err;
    }
  }

  async function removeProduct(cartItemId: number) {
    try {
      await cartApi.removeItem(cartItemId);
      loadCart();
    } catch (err) {
      loadCart();
      throw err;
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart: cart,
        open: open,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
        addItem: addItem,
        updateQuantity: updateQuantity,
        removeProduct: removeProduct,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
