export enum PromotionType {
  Quantity = 0,
  CartTotal = 1,
}

export enum PromotionReward {
  FreeItems = 0,
  PercentDiscount = 1,
}

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
