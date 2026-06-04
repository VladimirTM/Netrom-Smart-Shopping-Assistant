import { useEffect, useState, type ReactNode } from "react";
import type { Cart } from "../../components/shared/types/Cart";
import { cartApi } from "../../api/clients/CartApiClient";
import { CartContext } from "./cart-context";

function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);

  const loadCart = () => {
    cartApi.getCart().then(setCart);
  };

  async function addItem(productId: number, quantity: number) {
    await cartApi.addItem({ productId, quantity });
    loadCart();
  }

  async function updateQuantity(productId: number, quantity: number) {
    await cartApi.updateItem(productId, { quantity });
    loadCart();
  }

  async function removeProduct(productId: number) {
    await cartApi.removeItem(productId);
    loadCart();
  }

  useEffect(() => {
    loadCart();
  }, []);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
