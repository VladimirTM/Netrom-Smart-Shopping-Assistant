import { http } from "../base/http";

interface WishlistGetModel {
  productIds: number[];
}

export const wishlistApi = {
  getWishlist: () => http.get<WishlistGetModel>("/wishlist"),
  addItem: (productId: number) => http.post<WishlistGetModel>(`/wishlist/${productId}`, {}),
  removeItem: (productId: number) => http.remove<WishlistGetModel>(`/wishlist/${productId}`),
};
