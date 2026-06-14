import { http } from "../base/http";
import type { AnalyticsSummaryModel } from "../models/AnalyticsSummaryModel";

export const analyticsApi = {
  getSummary: () => http.get<AnalyticsSummaryModel>("/analytics/summary"),
};
