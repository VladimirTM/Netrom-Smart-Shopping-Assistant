import { useState, useCallback, useEffect, type ReactNode } from "react";
import { WishlistContext } from "./wishlist-context";
import { useAuth } from "../AuthContext/auth-context";

function storageKey(userId: number | null | undefined): string {
  return userId != null ? `wishlist_${userId}` : "wishlist_guest";
}

function loadFromStorage(key: string): Set<number> {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return new Set<number>(JSON.parse(raw));
  } catch {
    // ignore
  }
  return new Set<number>();
}

function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Set<number>>(() => loadFromStorage(storageKey(user?.userId)));

  // Reload wishlist from storage when the user changes (login / logout)
  useEffect(() => {
    setItems(loadFromStorage(storageKey(user?.userId)));
  }, [user?.userId]);

  const toggle = useCallback((productId: number) => {
    const key = storageKey(user?.userId);
    setItems((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      localStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
  }, [user?.userId]);

  const has = useCallback((productId: number) => items.has(productId), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, has }}>
      {children}
    </WishlistContext.Provider>
  );
}

export default WishlistProvider;
