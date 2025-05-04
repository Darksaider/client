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
// Тип для одного фото продукту на клієнті
interface ClientCartProductPhoto {
  photo_url: string;
  // position?: number | null; // Зазвичай позиція не потрібна для відображення в кошику
}

// Тип для даних продукту в кошику на клієнті
interface ClientCartProductData {
  id: number;
  name: string;
  description: string | null;
  price: string; // Prisma Decimal часто серіалізується як рядок для збереження точності
  stock: number | null;
  product_photos: ClientCartProductPhoto[]; // Масив з 0 або 1 фото
  // Якщо ви додавали бренд в запит:
  // product_brands: { brands: { name: string } }[];
}

// Тип для одного елемента кошика на клієнті
export interface ClientCartItem {
  id: number; // ID самого запису в кошику (cart.id)
  quantity: number | null;
  added_at: string | null;
  color_id: number | null; // ID кольору продукту
  size_id: number | null; // ID розміру продукту

  // Date зазвичай серіалізується як ISO рядок
  // Важливо: поле називається 'products', хоча містить дані ОДНОГО продукту,
  // бо саме так воно визначено у вашому select/include Prisma запиті
  products: ClientCartProductData;
  discount_percentage?: number; // Знижка на продукт, якщо є
  discounted_price?: number; // Знижка на продукт, якщо є
}

// --- Тип для пропсу компонента ---

// Якщо ваш компонент приймає весь масив елементів кошика як один пропс:
export interface CartItemsListProps {
  items: ClientCartItem[]; // Пропс 'items' є масивом елементів кошика
  // Тут можуть бути інші пропси, наприклад, функції для видалення, оновлення кількості:
  // onRemoveItem?: (cartItemId: number) => void;
  // onUpdateQuantity?: (cartItemId: number, newQuantity: number) => void;
}

// Або якщо компонент рендерить ОДИН елемент кошика:
export interface CartItemDisplayProps {
  item: ClientCartItem; // Пропс 'item' є одним елементом кошика
  // Тут також можуть бути інші пропси
  // onRemove?: () => void; // Функція видалення для цього конкретного елемента
  // onUpdateQuantity?: (newQuantity: number) => void;
}
