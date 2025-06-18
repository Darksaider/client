import { Color, Size } from "../pages/admin/admin.type";

export interface IFormSingInInput {
  email: string;
  password: string;
}
export interface ServerResponse {
  success: boolean;
  message: string;
}

export interface IFormRegisterInput {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IColor {
  id: number;
  name: string;
  hex_code: string;
}
export interface ITag {
  id: number;
  name: string;
}
export interface IBrand {
  id: number;
  name: string;
}
export interface ISize {
  id: number;
  size: string;
}
export interface ICategory {
  id: number;
  name: string;
}
export interface IDiscounts {
  id: number;
  name: string;
  description: string;
  discount_percentage: number;
  start_date: Date;
  end_date: Date;
  is_active: boolean;
}
export interface IFilter {
  colors: IColor[];
  sizes: ISize[];
  tags: IColor[];
  categories: ICategory[];
  brands: IBrand[];
  discounts: IDiscounts[];
}
export interface IFilterResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface Comment {
  id?: number | string;
  product_id: number | string;
  text: string;
  rating: number;
  created_at?: string;
  updated_at?: string;
  user_id?: number | string;
}

// Тип для одного елемента кошика на клієнті
export interface ClientCartItem {
  cartId: number | string; // ID самого запису в кошику (cart.id)
  quantity: number | null;
  product_id: number;
  added_at: string | null;
  name: string;
  description: string;
  price: string;
  stock: 90;
  photo_url: string;
  color: Color;
  size: Size;
  discounted_price?: string | number;
  discount_percentage?: number;
  // Date зазвичай серіалізується як ISO рядок
  // Важливо: поле називається 'products', хоча містить дані ОДНОГО продукту,
  // бо саме так воно визначено у вашому select/include Prisma запиті
  // products: ClientCartProductData;
  // discount_percentage?: number; // Знижка на продукт, якщо є
  // discounted_price?: number; // Знижка на продукт, якщо є
}

// --- Тип для пропсу компонента ---

// Якщо ваш компонент приймає весь масив елементів кошика як один пропс:
export interface CartItemsListProps {
  items: ClientCartItem[]; // Пропс 'items' є масивом елементів кошика
  // Тут можуть бути інші пропси, наприклад, функції для видалення, оновлення кількості:
  // onRemoveItem?: (cartcartId: number) => void;
  // onUpdateQuantity?: (cartcartId: number, newQuantity: number) => void;
}

// Або якщо компонент рендерить ОДИН елемент кошика:
export interface CartItemDisplayProps {
  item: ClientCartItem; // Пропс 'item' є одним елементом кошика
  // Тут також можуть бути інші пропси
  // onRemove?: () => void; // Функція видалення для цього конкретного елемента
  // onUpdateQuantity?: (newQuantity: number) => void;
}
