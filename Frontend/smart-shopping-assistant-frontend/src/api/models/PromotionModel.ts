export const PromotionType = {
  Quantity: 0,
  CartTotal: 1,
} as const;
export type PromotionType = (typeof PromotionType)[keyof typeof PromotionType];

export const PromotionReward = {
  FreeItems: 0,
  PercentDiscount: 1,
} as const;
export type PromotionReward = (typeof PromotionReward)[keyof typeof PromotionReward];

export interface PromotionModel {
  id: number;
  name: string;
  type: PromotionType;
  threshold: number;
  reward: PromotionReward;
  rewardValue: number;
  productId?: number;
  categoryId?: number;
  isActive: boolean;
}

export interface PromotionInput {
  name: string;
  type: PromotionType;
  threshold: number;
  reward: PromotionReward;
  rewardValue: number;
  productId?: number;
  categoryId?: number;
  isActive: boolean;
}
