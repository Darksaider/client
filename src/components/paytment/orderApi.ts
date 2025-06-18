import axios from "axios";
import { ProductI } from "../../types/product.type";
import { Color, Size } from "../../pages/admin/admin.type";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const API_URL = "http://localhost:3000";

export interface CartItem {
  id: string;
  product_id: number;
  name: string;
  description?: string;
  price: number;
  size: Size;
  color: Color;
  quantity: number;
  products: ProductI;
}

export interface OrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: string;
  notes?: string;
}

// Створення замовлення
export const createOrder = async (
  userId: number,
  cartItems: CartItem[],
  formData: OrderFormData,
) => {
  try {
    // Підготовка адреси
    const shippingAddress = `${formData.firstName} ${formData.lastName}, ${formData.address}, ${formData.city}, ${formData.phone}`;

    // Підготовка елементів замовлення
    const items = cartItems.map((item) => ({
      productId: item.product_id,
      sizeId: item.size.id,
      colorId: item.color.id,
      quantity: item.quantity,
      price: item.price,
    }));

    // Відправка запиту на створення замовлення
    const response = await axios.post(
      `${API_URL}/orders`,
      {
        userId,
        items,
        shippingAddress,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Помилка створення замовлення:", error);
    throw error;
  }
};

// Отримання замовлень користувача
export const getUserOrders = async (userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Помилка отримання замовлень:", error);
    throw error;
  }
};

// Отримання деталей замовлення
export const getOrderDetails = async (orderId: number) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Помилка отримання деталей замовлення:", error);
    throw error;
  }
};

// Скасування замовлення
export const cancelOrder = async (orderId: number, reason?: string) => {
  try {
    const response = await axios.post(`${API_URL}/orders/${orderId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Помилка скасування замовлення:", error);
    throw error;
  }
};
