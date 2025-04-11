import { useSearchParams } from "react-router"; // Краще імпортувати з react-router-dom
import { useMemo, useCallback } from "react"; // Додай useCallback

// Інтерфейс залишається тим самим
export interface ProductFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: number[];
  brands?: number[];
  colors?: number[];
  sizes?: number[];
  tags?: number[];
  inStock?: boolean;
  sortBy?: "price_asc" | "id_desc" | "price_desc" | "newest" | "popular";
  page?: number;
  limit?: number;
}

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Логіка парсингу фільтрів залишається такою ж
  const filters: Readonly<ProductFilters> = useMemo(() => {
    // Додано Readonly для кращої семантики
    const parseArrayParam = (param: string): number[] | undefined => {
      const value = searchParams.get(param);
      return value
        ? value
            .split(",")
            .map(Number)
            .filter((n) => !isNaN(n))
        : undefined;
    };
    const parseOptionalFloat = (param: string): number | undefined => {
      const value = searchParams.get(param);
      const num = parseFloat(value || "");
      return !isNaN(num) ? num : undefined;
    };
    const parseOptionalInt = (param: string): number | undefined => {
      const value = searchParams.get(param);
      const num = parseInt(value || "", 10);
      return !isNaN(num) ? num : undefined;
    };

    return Object.freeze({
      // Object.freeze для імутабельності
      search: searchParams.get("search") || undefined,
      minPrice: parseOptionalFloat("minPrice"),
      maxPrice: parseOptionalFloat("maxPrice"),
      inStock: searchParams.get("inStock") === "true" ? true : undefined, // Строга перевірка
      sortBy:
        (searchParams.get("sortBy") as ProductFilters["sortBy"]) || undefined, // Додай undefined
      page: parseOptionalInt("page") || 1, // Завжди повертаємо 1, якщо не вказано
      limit: parseOptionalInt("limit") || undefined, // Можна встановити дефолтний ліміт
      categories: parseArrayParam("categories"),
      brands: parseArrayParam("brands"),
      colors: parseArrayParam("colors"),
      sizes: parseArrayParam("sizes"),
      tags: parseArrayParam("tags"),
    });
  }, [searchParams]);

  // --- Оновлена функція updateFilters ---
  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      // Визначаємо, чи відбувається зміна фільтра (не сторінки)
      let isFilterChange = false;
      // Перевіряємо, чи є в newFilters хоча б один ключ, що не є 'page'
      for (const key in newFilters) {
        // Перевіряємо, чи ключ належить об'єкту і не є 'page'
        if (
          Object.prototype.hasOwnProperty.call(newFilters, key) &&
          key !== "page"
        ) {
          // Порівнюємо нове значення зі старим (якщо воно існує в URL)
          // Це потрібно, щоб не скидати сторінку, якщо фільтр встановили на те саме значення
          const oldValue = searchParams.get(key);
          const newValue = newFilters[key as keyof ProductFilters];
          const newValueStr =
            newValue === undefined ||
            newValue === null ||
            (Array.isArray(newValue) && newValue.length === 0)
              ? null // Якщо нове значення "порожнє", порівнюємо з відсутністю параметра
              : Array.isArray(newValue)
                ? newValue.join(",")
                : String(newValue); // Інакше конвертуємо в рядок

          // Якщо старого значення не було і нове не порожнє, АБО старе значення було і нове відрізняється
          if (
            (oldValue === null && newValueStr !== null) ||
            (oldValue !== null && oldValue !== newValueStr)
          ) {
            isFilterChange = true;
            break; // Знайшли зміну фільтра, далі можна не перевіряти
          }
        }
      }

      // Отримуємо поточну сторінку *до* застосування нових фільтрів
      const currentPage = parseInt(searchParams.get("page") || "1", 10);

      setSearchParams(
        (prevParams) => {
          const params = new URLSearchParams(prevParams);

          // Застосовуємо нові фільтри
          Object.entries(newFilters).forEach(([key, value]) => {
            const paramKey = key as keyof ProductFilters; // Допомагає TypeScript
            if (
              value === undefined ||
              value === null ||
              value === "" ||
              (Array.isArray(value) && value.length === 0)
            ) {
              params.delete(paramKey);
            } else {
              params.set(
                paramKey,
                Array.isArray(value) ? value.join(",") : String(value),
              );
            }
          });

          // !!! ЛОГІКА СКИДАННЯ СТОРІНКИ !!!
          // Якщо був змінений фільтр (не сторінка) і поточна сторінка не перша
          if (isFilterChange && currentPage > 1) {
            console.log("Filter change detected, resetting page to 1");
            params.set("page", "1");
          }
          // Якщо змінювали тільки 'page', ця умова не виконається

          return params;
        },
        { replace: true },
      ); // Використовуємо replace: true для фільтрів
    },
    [searchParams, setSearchParams],
  ); // Додали залежності в useCallback

  // Функція скидання всіх фільтрів (неявно скидає і сторінку)
  const resetFilters = useCallback(() => {
    console.log("Resetting all filters (including page implicitly)");
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Повертаємо об'єкт хука
  return { filters, updateFilters, resetFilters };
}
