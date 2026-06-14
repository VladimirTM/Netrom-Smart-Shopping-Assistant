export interface TopProductModel {
  productId: number;
  name: string;
  unitsSold: number;
}

export interface PromotionUsageModel {
  promotionId: number;
  name: string;
  usageCount: number;
}

export interface AnalyticsSummaryModel {
  totalOrders: number;
  totalRevenue: number;
  topProducts: TopProductModel[];
  promotionUsage: PromotionUsageModel[];
}
