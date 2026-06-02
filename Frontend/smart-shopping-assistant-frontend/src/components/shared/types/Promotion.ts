import type { PromotionModel } from "../../../api/models/PromotionModel";
import { PromotionReward, PromotionType } from "../../../api/models/PromotionModel";

export { PromotionType, PromotionReward };

export interface Promotion {
  id: number;
  name: string;
  type: PromotionType;
  threshold: number;
  reward: PromotionReward;
  rewardValue: number;
  productId: number | null;
  categoryId: number | null;
  isActive: boolean;
}

export function toPromotion(dto: PromotionModel): Promotion {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    threshold: dto.threshold,
    reward: dto.reward,
    rewardValue: dto.rewardValue,
    productId: dto.productId ?? null,
    categoryId: dto.categoryId ?? null,
    isActive: dto.isActive,
  };
}
