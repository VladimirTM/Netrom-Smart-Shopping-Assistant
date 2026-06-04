export interface AppliedPromotionModel {
  promotionName: string;
  discount: number;
}

export interface CartItemModel {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartModel {
  items: CartItemModel[];
  subtotal: number;
  appliedPromotions: AppliedPromotionModel[];
  totalDiscount: number;
  total: number;
}

export interface CartItemCreateInput {
  productId: number;
  quantity: number;
}

export interface CartItemUpdateInput {
  quantity: number;
}

export interface SuggestionModel {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  reason: string;
  imageUrl: string | null;
  savings: number | null;
}

export interface AnalysisResponseModel {
  summary: string;
  suggestions: SuggestionModel[];
}
