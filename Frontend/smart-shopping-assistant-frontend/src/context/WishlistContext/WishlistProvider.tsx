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
      try {
        const data = inWishlist
          ? await wishlistApi.removeItem(productId)
          : await wishlistApi.addItem(productId);
        setItems(new Set(data.productIds));
      } catch (err) {
        // Re-sync with server state so the local Set doesn't diverge
        try {
          const fresh = await wishlistApi.getWishlist();
          setItems(new Set(fresh.productIds));
        } catch {
          // If re-sync also fails, leave state as-is; next page load will re-fetch
        }
        throw err;
      }
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
