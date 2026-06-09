import type {
  AnalysisModel,
  SuggestionModel,
} from "../../../api/models/AnalysisModel";

export interface Suggestion {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  reason: string;
  imageUrl: string | null;
  savings: number | null;
}

export interface Analysis {
  summary: string;
  suggestions: Suggestion[];
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

export function toAnalysis(dto: AnalysisModel): Analysis {
  return {
    summary: dto.summary,
    suggestions: dto.suggestions.map(toSuggestion),
  };
}
