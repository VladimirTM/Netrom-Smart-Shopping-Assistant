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
  categories: ProductCategoryModel[];
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryIds: number[];
}
