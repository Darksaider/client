import axios, { AxiosError } from "axios";
import { useCallback } from "react";

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
    alert(errorMessage); // Стандартне повідомлення
  };

  const createItem = useCallback(
    async (data: TCreateData): Promise<any> => {
      try {
        const response = await axios.post(`${apiUrlBase}${apiEndpoint}`, data, {
          withCredentials: true, // Зберігаємо, якщо потрібно для POST
        });
        alert(
          `${resourceName} "${(data as any)?.name || ""}" успішно створено!`,
        ); // Спробуємо показати ім'я, якщо є
        refetch();
        if (onSuccess) onSuccess("create", response.data);
        return response.data; // Повертаємо дані створеного елемента
      } catch (error) {
        handleApiError(error as AxiosError<ApiError>, "create");
        throw error; // Перекидаємо помилку далі, щоб компонент міг на неї реагувати (опціонально)
      }
    },
    [apiUrlBase, apiEndpoint, resourceName, refetch, onSuccess, onError],
  ); // Додано onError

  const updateItem = useCallback(
    async (id: number | string, data: TUpdateData): Promise<any> => {
      try {
        const response = await axios.put(
          `${apiUrlBase}${apiEndpoint}/${id}`,
          data,
          {
            // Можливо, тут теж потрібен withCredentials: true?
          },
        );
        alert(
          `${resourceName} "${(data as any)?.name || ""}" успішно оновлено!`,
        );
        refetch();
        if (onSuccess) onSuccess("update", response.data);
        return response.data;
      } catch (error) {
        handleApiError(error as AxiosError<ApiError>, "update");
        throw error;
      }
    },
    [apiUrlBase, apiEndpoint, resourceName, refetch, onSuccess, onError],
  ); // Додано onError

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
          withCredentials: true, // Якщо потрібно для DELETE
        });
        alert(`${resourceName} з ID ${id} успішно видалено!`);
        refetch();
        if (onSuccess) onSuccess("delete");
      } catch (error) {
        handleApiError(error as AxiosError<ApiError>, "delete");
        throw error;
      }
    },
    [apiUrlBase, apiEndpoint, resourceName, refetch, onSuccess, onError],
  ); // Додано onError

  return { createItem, updateItem, deleteItem };
}
