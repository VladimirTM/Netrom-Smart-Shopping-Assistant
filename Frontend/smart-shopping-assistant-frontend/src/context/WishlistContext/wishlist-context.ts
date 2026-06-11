import { createContext, useContext } from "react";

interface WishlistContextValue {
  items: Set<number>;
  toggle: (productId: number) => void;
  has: (productId: number) => boolean;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
