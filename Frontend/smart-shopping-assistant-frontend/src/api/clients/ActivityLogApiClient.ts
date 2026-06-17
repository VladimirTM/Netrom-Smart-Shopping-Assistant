import { http } from "../base/http";
import type { ActivityLogModel } from "../models/ActivityLogModel";

interface ActivityLogPage {
  logs: ActivityLogModel[];
  total: number;
}

export const activityLogApi = {
  getPage: (limit = 50, offset = 0) =>
    http.get<ActivityLogPage>(`/admin/activity-log?limit=${limit}&offset=${offset}`),
  getLatest: (limit = 50) =>
    http.get<ActivityLogPage>(`/admin/activity-log?limit=${limit}`).then((r) => r.logs),
};
