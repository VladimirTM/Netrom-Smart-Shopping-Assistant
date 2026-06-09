export interface SuggestionModel {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  reason: string;
  imageUrl: string | null;
  savings: number | null;
}

export interface AnalysisModel {
  summary: string;
  suggestions: SuggestionModel[];
}
