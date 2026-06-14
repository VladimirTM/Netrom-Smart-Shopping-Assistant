export interface BannerModel {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkTo?: string;
  promotionId?: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface BannerInput {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkTo?: string;
  promotionId?: number;
  isActive: boolean;
  displayOrder: number;
}
