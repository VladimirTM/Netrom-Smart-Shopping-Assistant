export interface TopProductModel {
  productId: number;
  name: string;
  cartAdditions: number;
}

export interface PromotionUsageModel {
  promotionId: number;
  name: string;
  usageCount: number;
}

export interface AnalyticsSummaryModel {
  totalCarts: number;
  estimatedRevenue: number;
  topProducts: TopProductModel[];
  promotionUsage: PromotionUsageModel[];
}
