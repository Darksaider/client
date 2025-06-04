interface Brand {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

interface Color {
  id: number;
  name: string;
  hex_code: string;
}

interface Size {
  id: number;
  size: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Discount {
  id: number;
  name: string;
  description: string;
  discount_percentage: string; // String, щоб представляти відсоток
  start_date: string; // ISO 8601 date string
  end_date: string; // ISO 8601 date string
  is_active: boolean;
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
}

interface ProductPhoto {
  id: number;
  product_id: number;
  photo_url: string;
  cloudinary_public_id: string;
  created_at: string; // ISO 8601 date string
}

export interface ProductI {
  id: number;
  name: string;
  description: string;
  price: string; // String, оскільки має формат "xxx.xx"
  stock: number;
  sales_count: number;
  discounted_price?: string; // String, оскільки має формат "xxx.xx"
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  product_photos: ProductPhoto[];
}
export interface Product {
  id: number;
  name: string;
  description: string;
  price: string; // String, оскільки має формат "xxx.xx"
  stock: number;
  sales_count: number;
  discounted_price?: string; // String, оскільки має формат "xxx.xx"
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  product_photos: ProductPhoto[];
  product_brands: {
    id: number;
    product_id: number;
    brand_id: number;
    brands: Brand;
  }[];
  product_categories: {
    id: number;
    product_id: number;
    category_id: number;
    categories: Category;
  }[];
  product_colors: {
    id: number;
    product_id: number;
    color_id: number;
    colors: Color;
  }[];
  product_sizes: {
    id: number;
    product_id: number;
    size_id: number;
    sizes: Size;
  }[];
  product_tags: { id: number; product_id: number; tag_id: number; tags: Tag }[];
  product_discounts: {
    id: number;
    product_id: number;
    discount_id: number;
    discounts: Discount;
  }[];
  discount_percentage?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    products: Product[];
    productsCourt: number;
  };
}
export interface ProductItem {
  success: boolean;
  message: string;
  data: Product;
}
