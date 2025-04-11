// brands
export interface Brand {
  id: number;
  name: string;
}

// cart
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity?: number;
  added_at?: Date;
}

// categories
export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

// colors
export interface Color {
  id: number;
  name: string;
  hex_code: string;
}

// discounts
export interface Discount {
  id: number;
  name: string;
  description?: string;
  discount_percentage: number; // DECIMAL(5,2) => number
  start_date: Date;
  end_date: Date;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// favorites
export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
  added_at?: Date;
}

// product_brands
export interface ProductBrand {
  id: number;
  product_id: number;
  brand_id: number;
}

// product_colors
export interface ProductColor {
  id: number;
  product_id: number;
  color_id: number;
}

// product_photos
export interface ProductPhoto {
  id: number;
  product_id: number;
  photo_url: string;
  position?: number;
  created_at?: Date;
}

// product_sizes
export interface ProductSize {
  id: number;
  product_id: number;
  size_id: number;
}

// product_tags
export interface ProductTag {
  id: number;
  product_id: number;
  tag_id: number;
}

// products
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number; // DECIMAL(10,2) => number
  stock?: number;
  sales_count?: number;
  created_at?: Date;
  updated_at?: Date;
}

// sizes
export interface Size {
  id: number;
  size: string;
}

// tags
export interface Tag {
  id: number;
  name: string;
}

// users  (UPDATED)
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  role?: string;
  phone_number?: string;
  created_at?: Date;
  updated_at?: Date;
}

// product_categories
export interface ProductCategory {
  id: number;
  product_id: number;
  category_id: number;
}

// product_discounts
export interface ProductDiscount {
  id: number;
  product_id: number;
  discount_id: number;
}

// ---------------------- Brands ----------------------
export type CreateBrand = Omit<Brand, "id">;
export type UpdateBrand = Partial<Brand> & Pick<Brand, "id">;

// ---------------------- Cart ----------------------
export type CreateCartItem = Omit<CartItem, "id" | "added_at">;
export type UpdateCartItem = Partial<CartItem> & Pick<CartItem, "id">;

// ---------------------- Categories ----------------------
export type CreateCategory = Omit<Category, "id" | "created_at" | "updated_at">;
export type UpdateCategory = Partial<Category> & Pick<Category, "id">;

// ---------------------- Colors ----------------------
export type CreateColor = Omit<Color, "id">;
export type UpdateColor = Partial<Color> & Pick<Color, "id">;

// ---------------------- Discounts ----------------------
export type CreateDiscount = Omit<Discount, "id" | "created_at" | "updated_at">;
export type UpdateDiscount = Partial<Discount>;

// ---------------------- Favorites ----------------------
export type CreateFavorite = Omit<Favorite, "id" | "added_at">;
export type UpdateFavorite = Partial<Favorite> & Pick<Favorite, "id">;

// ---------------------- ProductBrands ----------------------
export type CreateProductBrand = Omit<ProductBrand, "id">;
export type UpdateProductBrand = Partial<ProductBrand> &
  Pick<ProductBrand, "id">;

// ---------------------- ProductColors ----------------------
export type CreateProductColor = Omit<ProductColor, "id">;
export type UpdateProductColor = Partial<ProductColor> &
  Pick<ProductColor, "id">;

// ---------------------- ProductPhotos ----------------------
export type CreateProductPhoto = Omit<ProductPhoto, "id" | "created_at">;
export type UpdateProductPhoto = Partial<ProductPhoto> &
  Pick<ProductPhoto, "id">;

// ---------------------- ProductSizes ----------------------
export type CreateProductSize = Omit<ProductSize, "id">;
export type UpdateProductSize = Partial<ProductSize> & Pick<ProductSize, "id">;

// ---------------------- ProductTags ----------------------
export type CreateProductTag = Omit<ProductTag, "id">;
export type UpdateProductTag = Partial<ProductTag> & Pick<ProductTag, "id">;

// ---------------------- Products ----------------------
export type CreateProduct = Omit<Product, "id" | "created_at" | "updated_at">;
export type UpdateProduct = Partial<Product> & Pick<Product, "id">;

// ---------------------- Sizes ----------------------
export type CreateSize = Omit<Size, "id">;
export type UpdateSize = Partial<Size> & Pick<Size, "id">;

// ---------------------- Tags ----------------------
export type CreateTag = Omit<Tag, "id">;
export type UpdateTag = Partial<Tag> & Pick<Tag, "id">;

// ---------------------- Users (UPDATED) ----------------------
export type CreateUser = Omit<User, "id" | "created_at" | "updated_at"> & {
  password: string;
};
export type UpdateUser = Partial<Omit<User, "created_at" | "updated_at">> &
  Pick<User, "id"> & {
    password_hash?: string;
  };

// ---------------------- ProductCategories ----------------------
export type CreateProductCategory = Omit<ProductCategory, "id">;
export type UpdateProductCategory = Partial<ProductCategory> &
  Pick<ProductCategory, "id">;

// ---------------------- ProductDiscounts ----------------------
export type CreateProductDiscount = Omit<ProductDiscount, "id">;
export type UpdateProductDiscount = Partial<ProductDiscount> &
  Pick<ProductDiscount, "id">;

// Доповнення до існуючого файлу admin.type.ts

export interface ProductNew {
  id: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  sales_count: number;
  created_at: string;
  updated_at: string;
  product_discounts?: ProductDiscountNew[];
  product_categories?: ProductCategoryNew[];
  product_brands?: ProductBrandNew[];
  product_colors?: ProductColorNew[];
  product_photos?: ProductPhotoNew[];
  product_sizes?: ProductSizeNew[];
  product_tags?: ProductTagNew[];
}

export interface UpdateProductNew
  extends Omit<ProductNew, "id" | "created_at" | "updated_at"> {}

interface ProductDiscountNew {
  id: number;
  product_id: number;
  discount_id: number;
  discounts?: {
    id: number;
    name: string;
    description: string;
    discount_percentage: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

interface ProductCategoryNew {
  id: number;
  product_id: number;
  category_id: number;
  categories?: {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
}

interface ProductBrandNew {
  id: number;
  product_id: number;
  brand_id: number;
  brands?: {
    id: number;
    name: string;
  };
}

interface ProductColorNew {
  id: number;
  product_id: number;
  color_id: number;
  colors?: {
    id: number;
    name: string;
    hex_code: string;
  };
}

interface ProductPhotoNew {
  id: number;
  product_id: number;
  photo_url: string;
  position: number;
  created_at: string;
}

interface ProductSizeNew {
  id: number;
  product_id: number;
  size_id: number;
  sizes?: {
    id: number;
    size: string;
  };
}

interface ProductTagNew {
  id: number;
  product_id: number;
  tag_id: number;
  tags?: {
    id: number;
    name: string;
  };
}
