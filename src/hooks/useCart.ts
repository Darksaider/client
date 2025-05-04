import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ClientCartItem,
  IFilterResponse,
  // Order,
  // OrderResponse,
} from "../types/types";
import apiClient from "./apiClient";

// Отримання даних кошика
const getDataCarts = async () => {
  const response =
    await apiClient.get<IFilterResponse<ClientCartItem[]>>("/cart");

  return response.data.data;
};

// Очищення всього кошика
const removeAllCartItems = async () => {
  const response = await apiClient.delete("/cart/clear");
  return response.data;
};

// Видалення окремого товару з кошика
const removeCartItem = async (itemId: number) => {
  const response = await apiClient.delete(`/cart/${itemId}`);
  return response.data;
};

// Оновлення кількості для товару в кошику
const updateCartItemQuantity = async ({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}) => {
  const response = await apiClient.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

// Створення замовлення
// const createOrder = async (orderData: Order) => {
const createOrder = async (orderData) => {
  const response = await apiClient.post("/api/orders", orderData);
  // const response = await apiClient.post<OrderResponse>("/orders", orderData);
  return response.data;
};

// Хук для отримання товарів кошика
export function useCarts(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getDataCarts(),
    select: (data) => data,
    enabled: isEnabled,
  });

  // useEffect(() => {
  //   if (isSuccess) console.log("Data fetched successfully");
  // }, [isSuccess, data]);

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, isError, isLoading, isSuccess, refetch, error };
}

// Хук для видалення окремого товару з кошика
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Хук для очищення всього кошика
export function useRemoveAllCartItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAllCartItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Хук для оновлення кількості товару
export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Хук для створення замовлення
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Після успішного створення замовлення оновлюємо кеш кошика
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // Якщо у вас є окремий кеш для замовлень, його також треба оновити
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
