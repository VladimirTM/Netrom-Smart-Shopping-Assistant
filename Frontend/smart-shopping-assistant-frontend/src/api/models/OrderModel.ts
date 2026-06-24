export interface OrderItemModel {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderAppliedPromotionModel {
  promotionId: number;
  promotionName: string;
  discount: number;
}

export interface ShippingAddressInput {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export interface OrderModel {
  id: number;
  items: OrderItemModel[];
  appliedPromotions: OrderAppliedPromotionModel[];
  total: number;
  status: string;
  placedAt: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingPhone: string;
}

export interface AdminOrderModel extends OrderModel {
  userEmail: string;
}
