// src/api/stripeApi.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface PaymentResponse {
  sessionId: string;
  url: string;
}

export interface PaymentStatus {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;
  paymentDetails: {
    id: number;
    amount: number;
    currency: string;
    payment_method: string;
    status: string;
    error_message?: string;
  } | null;
}

// Створити платіжну сесію для замовлення
export const createCheckoutSession = async (
  orderId: number,
  userId: number,
): Promise<PaymentResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/stripe/create-checkout-session`,
      {
        orderId,
        userId,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Помилка створення платіжної сесії:", error);
    throw error;
  }
};

// Отримати статус платежу
export const getPaymentStatus = async (
  orderId: number,
): Promise<PaymentStatus> => {
  try {
    const response = await axios.get(
      `${API_URL}/stripe/payment-status/${orderId}`,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error("Помилка отримання статусу платежу:", error);
    throw error;
  }
};
