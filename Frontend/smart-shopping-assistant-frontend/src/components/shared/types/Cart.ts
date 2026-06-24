import type {
  CartModel,
  CartItemModel,
  AppliedPromotionModel,
} from "../../../api/models/CartModel";

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  stockQuantity: number;
}

export interface AppliedPromotion {
  promotionId: number;
  promotionName: string;
  discount: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  appliedPromotions: AppliedPromotion[];
  totalDiscount: number;
  total: number;
}

export function toCartItem(dto: CartItemModel): CartItem {
  return {
    id: dto.id,
    productId: dto.productId,
    productName: dto.productName,
    price: dto.price,
    quantity: dto.quantity,
    subtotal: dto.subtotal,
    stockQuantity: dto.stockQuantity,
  };
}

export function toAppliedPromotion(
  dto: AppliedPromotionModel,
): AppliedPromotion {
  return { promotionId: dto.promotionId, promotionName: dto.promotionName, discount: dto.discount };
}

export function toCart(dto: CartModel): Cart {
  return {
    items: dto.items.map(toCartItem),
    subtotal: dto.subtotal,
    appliedPromotions: dto.appliedPromotions.map(toAppliedPromotion),
    totalDiscount: dto.totalDiscount,
    total: dto.total,
  };
}
