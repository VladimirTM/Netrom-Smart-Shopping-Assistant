import type {
  CartModel,
  CartItemModel,
  AppliedPromotionModel,
  SuggestionModel,
  AnalysisResponseModel,
} from "../../../api/models/CartModel";

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface AppliedPromotion {
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

export interface Suggestion {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  reason: string;
  imageUrl: string | null;
  savings: number | null;
}

export interface AnalysisResponse {
  summary: string;
  suggestions: Suggestion[];
}

export function toCartItem(dto: CartItemModel): CartItem {
  return {
    id: dto.id,
    productId: dto.productId,
    productName: dto.productName,
    price: dto.price,
    quantity: dto.quantity,
    subtotal: dto.subtotal,
  };
}

export function toAppliedPromotion(dto: AppliedPromotionModel): AppliedPromotion {
  return { promotionName: dto.promotionName, discount: dto.discount };
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

export function toSuggestion(dto: SuggestionModel): Suggestion {
  return {
    productId: dto.productId,
    name: dto.name,
    price: dto.price,
    quantity: dto.quantity,
    reason: dto.reason,
    imageUrl: dto.imageUrl,
    savings: dto.savings,
  };
}

export function toAnalysisResponse(dto: AnalysisResponseModel): AnalysisResponse {
  return {
    summary: dto.summary,
    suggestions: dto.suggestions.map(toSuggestion),
  };
}
