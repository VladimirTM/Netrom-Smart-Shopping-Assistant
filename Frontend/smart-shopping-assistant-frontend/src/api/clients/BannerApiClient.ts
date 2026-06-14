import { http } from "../base/http";
import type { BannerInput, BannerModel } from "../models/BannerModel";
import { toBanner, type Banner } from "../../components/shared/types/Banner";

export const bannersApi = {
  getAll: async (activeOnly = false): Promise<Banner[]> => {
    const data = await http.get<BannerModel[]>(`/banners${activeOnly ? "?activeOnly=true" : ""}`);
    return data.map(toBanner);
  },
  create: async (data: BannerInput): Promise<Banner> => {
    return toBanner(await http.post<BannerModel>("/banners", data));
  },
  update: async (id: number, data: BannerInput): Promise<Banner> => {
    return toBanner(await http.put<BannerModel>(`/banners/${id}`, data));
  },
  remove: (id: number) => http.remove<void>(`/banners/${id}`),
};
