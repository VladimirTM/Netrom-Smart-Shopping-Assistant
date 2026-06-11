import type { ProductModel } from "../../../api/models/ProductModel";

export interface ProductCategory {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  categories: ProductCategory[];
}

export function toProduct(dto: ProductModel): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    imageUrl: dto.imageUrl ?? "",
    price: dto.price,
    stockQuantity: dto.stockQuantity,
    categories: dto.categories,
  };
}
