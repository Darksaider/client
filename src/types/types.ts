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
