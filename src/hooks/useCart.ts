import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import { ClientCartItem, IFilterResponse } from "../types/types";
import apiClient from "./apiClient";
import { LocalCartItem, useLocalCart } from "./useLocalCart";
import { useAuthContext } from "./useLoginContext";

const getDataCarts = async (
  isLoggedIn: boolean,
  getLocalCart: () => LocalCartItem[],
) => {
  const fetchProductsForLocalCart = async (localCartItems: LocalCartItem[]) => {
    try {
      if (localCartItems.length === 0) {
        return [];
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
      return [];
    }
  };

  if (isLoggedIn) {
    const response =
      await apiClient.get<IFilterResponse<ClientCartItem[]>>("/cart");
    return response.data.data;
  } else {
    const localCart = getLocalCart();

    if (!localCart || localCart.length === 0) {
      return [];
    }

    return fetchProductsForLocalCart(localCart);
  }
};

const removeAllCartItems = async () => {
  const response = await apiClient.delete("/cart/clear");
  return response.data;
};

const removeCartItem = async (cartId: number) => {
  const response = await apiClient.delete(`/cart/${cartId}`);
  return response.data;
};

export function useCarts(isEnabled: boolean) {
  const { isLoggedIn } = useAuthContext();
  const { getLocalCart } = useLocalCart();
  const { data, isError, isLoading, isSuccess, refetch, error } = useQuery({
    queryKey: ["cart", isLoggedIn],
    queryFn: () => getDataCarts(isLoggedIn, getLocalCart),
    select: (data) => data,
    staleTime: 1000 * 60 * 2,
    enabled: isEnabled && isLoggedIn !== undefined,
  });

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return { data, isError, isLoading, isSuccess, refetch, error };
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveAllCartItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeAllCartItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

interface UpdateCartItemParams {
  cartId: number;
  quantity: number;
}

interface CartUpdateResponse {
  success: boolean;
}

interface MutationContext {
  previousCart?: ClientCartItem[];
}

// Зберігаємо останній валідний запит для кожного cartId
const pendingUpdates = new Map<
  number,
  {
    quantity: number;
    timestamp: number;
  }
>();

const updateCartItemQuantityOnServer = async ({
  cartId,
  quantity,
}: UpdateCartItemParams): Promise<CartUpdateResponse> => {
  // Зберігаємо інформацію про цей запит
  pendingUpdates.set(cartId, {
    quantity,
    timestamp: Date.now(),
  });

  try {
    const response = await apiClient.put(`/cart/${cartId}`, { quantity });

    // Видаляємо з pending після успішного виконання
    pendingUpdates.delete(cartId);

    return response.data;
  } catch (error) {
    // Якщо це не AbortError, видаляємо з pending
    if (error.name !== "AbortError") {
      pendingUpdates.delete(cartId);
    }
    throw error;
  }
};

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthContext();
  const { updateQuantityInLocalCart } = useLocalCart();

  // Debounce таймери для кожного cartId
  const debounceTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const queryKey = ["cart", isLoggedIn];

  const debouncedUpdate = useCallback(
    (cartId: number, quantity: number) => {
      // Очищуємо попередній таймер для цього cartId
      const existingTimer = debounceTimers.current.get(cartId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      // Створюємо новий таймер
      const timer = setTimeout(async () => {
        try {
          if (isLoggedIn) {
            await updateCartItemQuantityOnServer({ cartId, quantity });
          } else {
            updateQuantityInLocalCart(cartId.toString(), quantity);
          }

          // Оновлюємо кеш після успішного запиту
          queryClient.invalidateQueries({ queryKey });
        } catch (error) {
          if (error.name !== "AbortError") {
            console.error("Помилка оновлення кількості:", error);
            // Відновлюємо дані з кешу при помилці
            queryClient.invalidateQueries({ queryKey });
          }
        } finally {
          debounceTimers.current.delete(cartId);
        }
      }, 500); // 500ms debounce

      debounceTimers.current.set(cartId, timer);
    },
    [isLoggedIn, updateQuantityInLocalCart, queryClient, queryKey],
  );

  return useMutation({
    mutationFn: async ({ cartId, quantity }: UpdateCartItemParams) => {
      // Запускаємо debounced оновлення
      debouncedUpdate(cartId, quantity);

      // Повертаємо успішну відповідь для негайного оновлення UI
      return Promise.resolve({ success: true });
    },

    onMutate: async ({
      cartId,
      quantity,
    }: UpdateCartItemParams): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<ClientCartItem[]>(queryKey);

      queryClient.setQueryData<ClientCartItem[]>(queryKey, (old) =>
        old
          ? old.map((item) =>
              String(item.cartId) === String(cartId)
                ? { ...item, quantity }
                : item,
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
      // Відновлюємо попередній стан тільки якщо це не AbortError
      if (err.name !== "AbortError" && context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      console.error("Помилка оновлення кількості:", err);
    },

    // Прибираємо onSettled, щоб не викликати зайві invalidateQueries
  });
}
