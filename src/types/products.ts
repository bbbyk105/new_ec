/* eslint-disable @typescript-eslint/no-explicit-any */
// types/product.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  imageUrl?: string;
  images: string[];
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  sku?: string;
  stock: number;
  lowStockThreshold: number;
  categoryId: string;
  imageUrl?: string;
  images: string[];
  isActive: boolean;
}

export interface ProductResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  error?: string;
}

export interface CategoryResponse {
  success: boolean;
  data: Category[];
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 商品ステータス用のenums
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  OUT_OF_STOCK = "out_of_stock",
  LOW_STOCK = "low_stock",
}

// 検索フィルター用の型
export interface ProductFilter {
  search?: string;
  category?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

// 統計データ用の型
export interface ProductStats {
  total: number;
  active: number;
  lowStock: number;
  outOfStock: number;
}
