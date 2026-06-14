import type { BannerModel } from "../../../api/models/BannerModel";

export interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  linkTo: string | null;
  promotionId: number | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export function toBanner(dto: BannerModel): Banner {
  return {
    id: dto.id,
    title: dto.title,
    subtitle: dto.subtitle ?? null,
    imageUrl: dto.imageUrl ?? null,
    linkTo: dto.linkTo ?? null,
    promotionId: dto.promotionId ?? null,
    isActive: dto.isActive,
    displayOrder: dto.displayOrder,
    createdAt: dto.createdAt,
  };
}
