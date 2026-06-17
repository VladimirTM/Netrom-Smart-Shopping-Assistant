import { useState, useCallback, useEffect, type ReactNode } from "react";
import { WishlistContext } from "./wishlist-context";
import { useAuth } from "../AuthContext/auth-context";
import { wishlistApi } from "../../api/clients/WishlistApiClient";

function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isAuthenticated) {
      wishlistApi
        .getWishlist()
        .then((data) => setItems(new Set(data.productIds)))
        .catch(() => setItems(new Set()));
    } else {
      setItems(new Set());
    }
  }, [isAuthenticated]);

  const toggle = useCallback(
    async (productId: number) => {
      const inWishlist = items.has(productId);
      const data = inWishlist
        ? await wishlistApi.removeItem(productId)
        : await wishlistApi.addItem(productId);
      setItems(new Set(data.productIds));
    },
    [items]
  );

  const has = useCallback((productId: number) => items.has(productId), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
