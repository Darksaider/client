import axios, { AxiosError } from "axios";
import { useCallback } from "react";
import toast from "react-hot-toast";

// Загальний тип для помилок API (можна розширити за потреби)
interface ApiError {
  message: string;
  // Можна додати інші поля, які повертає ваш бекенд при помилках
}

// Типи для параметрів та поверненого значення хука
interface UseCrudOperationsParams {
  resourceName: string; // Назва ресурсу для повідомлень (напр., "Знижка", "Категорія")
  apiEndpoint: string; // Шлях до API (напр., "/discount", "/category")
  apiUrlBase: string; // Базова URL API (з .env)
  refetch: () => void; // Функція для оновлення списку даних
  onError?: (
    error: AxiosError<ApiError> | Error,
    operation: "create" | "update" | "delete",
  ) => void; // Опційний обробник помилок
  onSuccess?: (operation: "create" | "update" | "delete", data?: any) => void; // Опційний обробник успіху
}

interface CrudOperations<TCreateData, TUpdateData> {
  createItem: (data: TCreateData) => Promise<any>; // Повертає створений елемент або дані відповіді
  updateItem: (id: number | string, data: TUpdateData) => Promise<any>; // Повертає оновлений елемент або дані відповіді
  deleteItem: (id: number | string) => Promise<void>;
}

export function useCrudOperations<TCreateData, TUpdateData>({
  resourceName,
  apiEndpoint,
  apiUrlBase,
  refetch,
  onError,
  onSuccess,
}: UseCrudOperationsParams): CrudOperations<TCreateData, TUpdateData> {
  const handleApiError = (
    error: AxiosError<ApiError> | Error,
    operation: "create" | "update" | "delete",
  ) => {
    console.error(
      `Помилка ${operation === "create" ? "створення" : operation === "update" ? "оновлення" : "видалення"} ${resourceName}:`,
      error,
    );
    if (onError) {
      onError(error as AxiosError<ApiError>, operation);
    }
    // Визначаємо повідомлення про помилку
    let errorMessage = `Помилка ${operation === "create" ? "створення" : operation === "update" ? "оновлення" : "видалення"} ${resourceName}.`;
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      // Якщо бекенд повертає конкретне повідомлення
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage, {
      duration: 5000,
    }); // Тривалість повідомлення
  };

  const createItem = useCallback(
    async (data: TCreateData): Promise<any> => {
      try {
        // Визначаємо правильні заголовки в залежності від типу даних
        const headers =
          data instanceof FormData
            ? undefined // axios автоматично встановить правильний Content-Type для FormData
            : { "Content-Type": "application/json" };

        const response = await axios.post(`${apiUrlBase}${apiEndpoint}`, data, {
          withCredentials: true,
          headers,
        });

        // Отримуємо ім'я об'єкта для повідомлення, якщо це не FormData
        let objectName = "";
        if (!(data instanceof FormData) && (data as any)?.name) {
          objectName = (data as any).name;
        }

        toast.success(`${resourceName} "${objectName}" успішно створено!`);
        refetch();
        if (onSuccess) onSuccess("create", response.data);
        return response.data;
      } catch (error) {
        handleApiError(error as AxiosError<ApiError>, "create");
        throw error;
      }
    },
    [apiUrlBase, apiEndpoint, resourceName, refetch, onSuccess],
  );

  const updateItem = useCallback(
    async (id: number | string, data: TUpdateData): Promise<any> => {
      try {
        // Визначаємо правильні заголовки в залежності від типу даних
        const headers =
          data instanceof FormData
            ? undefined // axios автоматично встановить правильний Content-Type для FormData
            : { "Content-Type": "application/json" };

        const response = await axios.put(
          `${apiUrlBase}${apiEndpoint}/${id}`,
          data,
          {
            withCredentials: true,
            headers,
          },
        );

        // Отримуємо ім'я об'єкта для повідомлення, якщо це не FormData
        let objectName = "";
        if (!(data instanceof FormData) && (data as any)?.name) {
          objectName = (data as any).name;
        }

        toast.success(`${resourceName} "${objectName}" успішно оновлено!`);
        refetch();
        if (onSuccess) onSuccess("update", response.data);
        return response.data;
      } catch (error) {
        handleApiError(error as AxiosError<ApiError>, "update");
        throw error;
      }
    },
    [apiUrlBase, apiEndpoint, resourceName, refetch, onSuccess],
  );

  const deleteItem = useCallback(
    async (id: number | string): Promise<void> => {
      // Запит підтвердження перед видаленням
      if (
        !window.confirm(
          `Ви впевнені, що хочете видалити ${resourceName} з ID ${id}?`,
        )
      ) {
        return; // Користувач скасував дію
      }

      try {
        await axios.delete(`${apiUrlBase}${apiEndpoint}/${id}`, {
          withCredentials: true,
        });
        toast.success(`${resourceName} з ID ${id} успішно видалено!`);
        refetch();
        if (onSuccess) onSuccess("delete");
      } catch (error) {
        handleApiError(error as AxiosError<ApiError>, "delete");
        throw error;
      }
    },
    [apiUrlBase, apiEndpoint, resourceName, refetch, onSuccess],
  );

  return { createItem, updateItem, deleteItem };
}
