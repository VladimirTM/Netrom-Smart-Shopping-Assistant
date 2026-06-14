import { http } from "../base/http";
import type { AdminOrderModel, OrderModel, ShippingAddressInput } from "../models/OrderModel";

export const ordersApi = {
  place: (shippingAddress: ShippingAddressInput): Promise<OrderModel> =>
    http.post<OrderModel>("/orders", { shippingAddress }),
  getAll: (): Promise<OrderModel[]> => http.get<OrderModel[]>("/orders"),
};

export const adminOrdersApi = {
  getAll: (): Promise<AdminOrderModel[]> => http.get<AdminOrderModel[]>("/admin/orders"),
  updateStatus: (id: number, status: string): Promise<void> =>
    http.put<void>(`/admin/orders/${id}/status`, { status }),
};
