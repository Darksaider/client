import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ClientCartItem,
  IFilterResponse,
  // Order,
  // OrderResponse,
} from "../types/types";
import apiClient from "./apiClient";
import { useAuth } from "./useLogin";
import { LocalCartItem, useLocalCart } from "./useLocalCart";

const getDataCarts = async (
  isLoggedIn: boolean,
  getLocalCart: () => LocalCartItem[],
) => {
  const fetchProductsForLocalCart = async (localCartItems: LocalCartItem[]) => {
    try {
      if (localCartItems.length === 0) {
        return []; // Повертаємо пустий масив замість undefined
      }

      const response = await apiClient.get(`/cart/get`, {
        params: { data: JSON.stringify(localCartItems) },
      });

      if (response.data && Array.isArray(response.data)) {
        const fullCartItems = response.data.map((product) => {
          const localItem = localCartItems.find(
            (item) =>
              item.product_id === product.product_id &&
              item.color_id === product.color.id &&
              item.size_id === product.size.id,
          );

          return {
            ...product,
            id: product.id || product.product_id,
            product_id: product.id || product.product_id,
            quantity: localItem ? localItem.quantity : 1,
            cartId: localItem ? localItem.cartId : null,
          };
        });
        return fullCartItems;
      } else {
        throw new Error("Некоректний формат відповіді від API");
      }
    } catch (error) {
      console.error("Помилка при отриманні даних про товари:", error);
      return []; // Повертаємо пустий масив у випадку помилки
    }
  };

  if (isLoggedIn) {
    const response =
      await apiClient.get<IFilterResponse<ClientCartItem[]>>("/cart");
    return response.data.data;
  } else {
    const localCart = getLocalCart();

    if (!localCart || localCart.length === 0) {
      return []; // Одразу повертаємо пустий масив
    }

    return fetchProductsForLocalCart(localCart);
  }
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

export function useCarts(isEnabled: boolean) {
  const { isLoggedIn } = useAuth();
  const { getLocalCart } = useLocalCart();
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["cart", isLoggedIn],
    queryFn: () => getDataCarts(isLoggedIn, getLocalCart),
    select: (data) => data,
    enabled: isEnabled && isLoggedIn !== undefined,
  });

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

// Типи для параметрів мутації
interface UpdateCartItemParams {
  itemId: number;
  quantity: number;
}

// Тип для відповіді API
interface CartUpdateResponse {
  success: boolean;
}

// Контекст для rollback при помилці
interface MutationContext {
  previousCart?: ClientCartItem[];
}

// Функція для API виклику (тільки для авторизованих користувачів)
const updateCartItemQuantityOnServer = async ({
  itemId,
  quantity,
}: UpdateCartItemParams): Promise<CartUpdateResponse> => {
  const response = await apiClient.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

// Хук для оновлення кількості товару в кошику
export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const { updateQuantityInLocalCart } = useLocalCart();
  return useMutation({
    mutationFn: async ({
      itemId,
      quantity,
    }: UpdateCartItemParams): Promise<CartUpdateResponse> => {
      if (isLoggedIn) {
        // Для авторизованих користувачів - серверний запит
        return updateCartItemQuantityOnServer({ itemId, quantity });
      } else {
        // Для неавторизованих - оновлення localStorage
        updateQuantityInLocalCart(itemId.toString(), quantity);
        return Promise.resolve({ success: true });
      }
    },

    onMutate: async ({
      itemId,
      quantity,
    }: UpdateCartItemParams): Promise<MutationContext> => {
      // Скасовуємо всі поточні запити до кошика для обох типів користувачів
      await queryClient.cancelQueries({ queryKey: ["cart"] });

      const previousCart = queryClient.getQueryData<ClientCartItem[]>(["cart"]);

      // Оптимістично оновлюємо кеш для всіх користувачів
      queryClient.setQueryData<ClientCartItem[]>(["cart"], (old) =>
        old
          ? old.map((item) =>
              item.cartId === itemId ? { ...item, quantity } : item,
            )
          : [],
      );

      return { previousCart };
    },

    onError: (
      err: Error,
      variables: UpdateCartItemParams,
      context: MutationContext | undefined,
    ) => {
      // Rollback тільки для авторизованих користувачів при серверних помилках
      if (context?.previousCart && isLoggedIn) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      // Для неавторизованих користувачів localStorage вже оновлений, тому rollback не потрібен
    },

    onSettled: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });
}
