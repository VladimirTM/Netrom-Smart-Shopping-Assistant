import { http } from "../base/http";
import type { ActivityLogModel } from "../models/ActivityLogModel";

export const activityLogApi = {
  getLatest: (limit = 50) =>
    http.get<ActivityLogModel[]>(`/admin/activity-log?limit=${limit}`),
};
