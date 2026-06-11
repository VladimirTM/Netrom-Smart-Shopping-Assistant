export interface ProductCategoryModel {
  id: number;
  name: string;
}

export interface ProductModel {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price: number;
  stockQuantity: number;
  categories: ProductCategoryModel[];
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  categoryIds: number[];
}
