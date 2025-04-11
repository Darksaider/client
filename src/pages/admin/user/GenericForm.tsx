import React, { ReactNode, useEffect, useState, useCallback } from "react";
import {
  useForm,
  FieldValues,
  RegisterOptions,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import { formatDateForInput } from "../../../hooks/fn";

// --- Інтерфейс FormField ---
export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type:
    | "text"
    | "email"
    | "select"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "checkbox"
    | "checkbox-group"
    | "date"; // <-- Додано 'date'
  options?: Array<{ value: string | number; label: string }>;
  validation?: RegisterOptions<T>;
  preview?: (value: any) => ReactNode;
}

// --- Інтерфейс GenericFormProps ---
interface GenericFormProps<T extends FieldValues> {
  defaultValues: T;
  fields: FormField<T>[];
  onSubmit: (data: T) => void; // Функція onSubmit отримує дані з форми (дати будуть рядками 'YYYY-MM-DD')
  title?: string;
  submitLabel?: string;
  className?: string;
}

// --- Компонент GenericForm ---
export function GenericForm<T extends FieldValues>({
  defaultValues,
  fields,
  onSubmit,
  title,
  submitLabel = "Зберегти",
  className = "border p-4 mb-4 rounded-lg bg-white shadow-sm",
}: GenericFormProps<T>) {
  const formMethods: UseFormReturn<T> = useForm<T>({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = formMethods;

  const [checkboxGroupCheckedState, setCheckboxGroupCheckedState] = useState<
    Record<string, Set<string | number>>
  >({});

  // --- Обробка defaultValues при монтуванні та оновленні ---
  useEffect(() => {
    const processedDefaults: Partial<T> = {};
    const initialCheckboxState: Record<string, Set<string | number>> = {};

    fields.forEach((field) => {
      const fieldName = field.name;
      const rawValueFromProduct = defaultValues[fieldName];

      if (field.type === "select") {
        // ... (ваша логіка для select)
        if (
          fieldName === "product_brands" &&
          Array.isArray(rawValueFromProduct) &&
          rawValueFromProduct.length > 0
        ) {
          const brandId =
            rawValueFromProduct[0]?.brand_id ??
            rawValueFromProduct[0]?.brands?.id;
          if (brandId !== undefined) {
            processedDefaults[fieldName] = brandId as PathValue<T, Path<T>>;
          }
        } else if (
          typeof rawValueFromProduct === "string" ||
          typeof rawValueFromProduct === "number"
        ) {
          processedDefaults[fieldName] = rawValueFromProduct as PathValue<
            T,
            Path<T>
          >;
        }
      } else if (field.type === "checkbox-group") {
        // ... (ваша логіка для checkbox-group)
        let extractedIds: (string | number)[] = [];
        if (Array.isArray(rawValueFromProduct)) {
          let idKey: string | null = null;
          if (fieldName === "product_categories") idKey = "category_id";
          else if (fieldName === "product_sizes") idKey = "size_id";
          else if (fieldName === "product_colors") idKey = "color_id";
          else if (fieldName === "product_tags") idKey = "tag_id";
          else if (fieldName === "product_brands") idKey = "brand_id";

          if (idKey) {
            extractedIds = rawValueFromProduct
              .map((item: any) => {
                const nestedObjectName = fieldName.replace("product_", "");
                return item?.[idKey] ?? item?.[nestedObjectName]?.id;
              })
              .filter((id: number) => id !== null && id !== undefined);
          }
        }
        processedDefaults[fieldName] = extractedIds as PathValue<T, Path<T>>;
        initialCheckboxState[String(fieldName)] = new Set(extractedIds);
      }
      // --- Обробка для типу 'date' ---
      else if (field.type === "date") {
        if (rawValueFromProduct) {
          // Конвертуємо Date або ISO рядок в 'YYYY-MM-DD' для інпуту
          processedDefaults[fieldName] = formatDateForInput(
            rawValueFromProduct,
          ) as PathValue<T, Path<T>>;
        } else {
          // Якщо значення немає, встановлюємо порожній рядок
          processedDefaults[fieldName] = "" as PathValue<T, Path<T>>;
        }
      } else if (rawValueFromProduct !== undefined) {
        processedDefaults[fieldName] = rawValueFromProduct as PathValue<
          T,
          Path<T>
        >;
      }
    });

    reset({ ...defaultValues, ...processedDefaults });
    setCheckboxGroupCheckedState(initialCheckboxState);
  }, [defaultValues, fields, reset]);

  const handleCheckboxGroupChange = useCallback(
    (name: Path<T>, optionValue: string | number, checked: boolean) => {
      const fieldName = String(name);
      setCheckboxGroupCheckedState((prev) => {
        const newSet = new Set(prev[fieldName] || []);
        if (checked) newSet.add(optionValue);
        else newSet.delete(optionValue);
        // Оновлюємо значення в react-hook-form
        setValue(name, Array.from(newSet) as PathValue<T, Path<T>>, {
          shouldValidate: true,
          shouldDirty: true,
        });
        return { ...prev, [fieldName]: newSet };
      });
    },
    [setValue],
  );

  const isCheckboxChecked = useCallback(
    (name: string, value: string | number): boolean => {
      return checkboxGroupCheckedState[name]?.has(value) || false;
    },
    [checkboxGroupCheckedState],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {title && <h3 className="text-lg font-medium mb-3">{title}</h3>}

      {fields.map((field) => {
        const fieldName = field.name as string;
        return (
          <div key={fieldName} className="mb-4">
            {/* --- Checkbox --- */}
            {field.type === "checkbox" ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={fieldName}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  {...register(field.name, field.validation)}
                />
                <label
                  htmlFor={fieldName}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  {field.label}
                </label>
              </div>
            ) : /* --- Checkbox Group --- */
            field.type === "checkbox-group" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {field.options?.map((option) => {
                    const optionId = `${fieldName}-${option.value}`;
                    const isChecked = isCheckboxChecked(
                      fieldName,
                      option.value,
                    );
                    return (
                      <div key={optionId} className="flex items-center">
                        <input
                          type="checkbox"
                          id={optionId}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxGroupChange(
                              field.name,
                              option.value,
                              e.target.checked,
                            )
                          }
                        />
                        <label
                          htmlFor={optionId}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {option.label}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  {...register(field.name, field.validation)}
                />
              </div>
            ) : /* --- Date Input --- */ // <-- Додано блок для дати
            field.type === "date" ? (
              <>
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}:
                </label>
                <input
                  id={fieldName}
                  type="date" // Встановлюємо тип 'date'
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                  {...register(field.name, field.validation)} // Реєструємо поле
                />
              </>
            ) : (
              /* --- Інші типи полів (Select, Text, Number) --- */
              <>
                <label
                  htmlFor={fieldName}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}:
                </label>
                {field.type === "select" ? (
                  <select
                    id={fieldName}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    {...register(field.name, field.validation)}
                  >
                    <option value="">Виберіть...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  /* --- Стандартні інпути (Text, Number, etc.) --- */
                  <input
                    id={fieldName}
                    // Використовуємо field.type для визначення типу інпута
                    type={
                      field.type === "tel" ||
                      field.type === "url" ||
                      field.type === "email" ||
                      field.type === "password" ||
                      field.type === "number"
                        ? field.type
                        : "text"
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
                    {...register(field.name, field.validation)}
                  />
                )}
              </>
            )}

            {/* --- Відображення помилок валідації --- */}
            {errors[fieldName] && (
              <p className="text-red-500 text-xs mt-1">
                {(errors[fieldName]?.message as string) || "Помилка валідації"}
              </p>
            )}

            {/* --- Preview --- */}
            {field.preview && watch(field.name) !== undefined && (
              <div className="mt-2 text-sm text-gray-600">
                {field.preview(watch(field.name))}
              </div>
            )}
          </div>
        );
      })}

      {/* --- Кнопка Submit --- */}
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Збереження..." : submitLabel}
      </button>
    </form>
  );
}
