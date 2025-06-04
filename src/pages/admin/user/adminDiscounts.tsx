import React, { useState, useCallback } from "react";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "../../../hooks/useExpandableRows";
import { useDiscounts } from "../../../hooks/hooks";
import { useCrudOperations } from "../../../hooks/useCrud";
import { formatDateForInput } from "../../../hooks/fn";
import { CreateDiscount, Discount, UpdateDiscount } from "../admin.type";

// Тип даних, з якими працює ФОРМА (дати як рядки)
interface DiscountFormData {
  name: string;
  discount_percentage: number; // Форма завжди працює з числом
  start_date: string;
  end_date: string;
  is_active: boolean;
}
const createFormDefaultValues: DiscountFormData = {
  name: "", // Порожній рядок
  discount_percentage: 0, // Початковий відсоток 0
  start_date: formatDateForInput(new Date()), // Сьогоднішня дата як рядок
  end_date: formatDateForInput(
    new Date(new Date().setDate(new Date().getDate() + 7)),
  ), // Дата через тиждень як рядок
  is_active: true, // За замовчуванням активна
};
// Конфігурація полів для форми (відноситься до DiscountFormData)
const discountFormFields: FormField<DiscountFormData>[] = [
  {
    name: "name",
    label: "Назва знижки",
    type: "text",
    validation: { required: "Назва обов'язкова" },
  },
  {
    name: "discount_percentage",
    label: "% знижки",
    type: "number",
    validation: {
      required: "Відсоток обов'язковий",
      min: { value: 0, message: "Відсоток не може бути від'ємним" }, // Дозволяємо 0
      max: { value: 100, message: "Відсоток не може перевищувати 100" },
      valueAsNumber: true, // Важливо для react-hook-form з type="number"
    },
  },
  {
    name: "start_date",
    label: "Дата початку",
    type: "date",
    validation: { required: "Дата початку обов'язкова" },
  },
  {
    name: "end_date",
    label: "Дата кінця",
    type: "date",
    validation: {
      required: "Дата кінця обов'язкова",
      validate: (value, formValues) => {
        const startDateValue = formValues.start_date;
        const endDateValue = value; // 'value' - це поточне значення поля end_date

        // 1. Перевіряємо, чи ОБИДВА значення є РЯДКАМИ і НЕ ПОРОЖНІМИ
        if (
          typeof startDateValue === "string" &&
          startDateValue &&
          typeof endDateValue === "string" &&
          endDateValue
        ) {
          try {
            const startDate = new Date(startDateValue);
            const endDate = new Date(endDateValue);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              return "Некоректний формат дати";
            }

            return (
              endDate >= startDate ||
              "Дата кінця має бути не раніше дати початку"
            );
          } catch (e) {
            return "Помилка обробки дати";
          }
        }
        return true;
      },
    },
  },
  { name: "is_active", label: "Активна", type: "checkbox" },
];

export const AdminDiscounts: React.FC = () => {
  const apiUrlBase = import.meta.env.VITE_API_URL;
  const {
    data: discountsRaw,
    isLoading: isLoadingDiscounts,
    refetch: refetchDiscounts,
  } = useDiscounts(true);
  const { expandedRows, toggleRow } = useExpandableRows<number>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // Використовуємо хук CRUD з оновленими типами
  const { createItem, updateItem, deleteItem } = useCrudOperations<
    CreateDiscount,
    UpdateDiscount
  >({
    // <-- Оновлені типи
    resourceName: "Знижка",
    apiEndpoint: "/discount",
    apiUrlBase: apiUrlBase,
    refetch: refetchDiscounts,
  });

  const handleUpdateSubmit = useCallback(
    async (discountId: number, formData: DiscountFormData) => {
      try {
        const dataToSend: UpdateDiscount = {
          // <-- Тип для оновлення
          id: discountId, // <-- Додано ID
          name: formData.name,
          discount_percentage: formData.discount_percentage,
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          is_active: formData.is_active,
        };
        await updateItem(discountId, dataToSend); // updateItem очікує UpdateDiscountPayload
        toggleRow(discountId);
      } catch (error) {
        console.error("Помилка оновлення в компоненті:", error);
      }
    },
    [updateItem, toggleRow],
  );

  const handleCreateSubmit = useCallback(
    async (formData: DiscountFormData) => {
      try {
        // Конвертуємо рядкові дати з форми назад в Date
        // ID НЕ ДОДАЄМО
        const dataToSend: CreateDiscount = {
          // <-- Тип для створення (без ID)
          name: formData.name,
          // Як і при оновленні, можливо потрібна логіка для null
          discount_percentage: formData.discount_percentage,
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          is_active: formData.is_active,
        };
        await createItem(dataToSend); // createItem очікує CreateDiscountPayload
        setShowCreateForm(false);
      } catch (error) {
        console.error("Помилка створення в компоненті:", error);
      }
    },
    [createItem],
  );

  // Обробник для кнопки ВИДАЛЕННЯ
  const handleDeleteClick = useCallback(
    (discountId: number) => {
      deleteItem(discountId).catch((error) => {
        console.error("Помилка видалення в компоненті:", error);
      });
    },
    [deleteItem],
  );

  // --- Конфігурація таблиці ---
  const columns = [
    { header: "ID", key: "id", width: "5%" },
    {
      header: "Назва",
      key: "name",
      width: "25%",
      render: (item: Discount) => <span className="truncate">{item.name}</span>,
    },
    // Використовуємо ?? 'N/A' або ?? 0 для discount_percentage, якщо він може бути null
    {
      header: "%",
      key: "discount_percentage",
      width: "10%",
      render: (item: Discount) => `${item.discount_percentage ?? 0}%`,
    },
    {
      header: "Початок",
      key: "start_date",
      width: "15%",
      render: (item: Discount) =>
        item.start_date
          ? new Date(item.start_date).toLocaleDateString("uk-UA")
          : "N/A",
    },
    {
      header: "Кінець",
      key: "end_date",
      width: "15%",
      render: (item: Discount) =>
        item.end_date
          ? new Date(item.end_date).toLocaleDateString("uk-UA")
          : "N/A",
    },
    // { header: "Статус", key: "is_active", width: "10%", render: (item: Discount) => ( /* ваш рендер статусу */) },
    {
      header: "Дії",
      key: "actions",
      width: "20%",
      render: (item: Discount) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleRow(item.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
          >
            {expandedRows.includes(item.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button
            onClick={() => handleDeleteClick(item.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Видалити
          </button>
        </div>
      ),
    },
  ];

  // Функція рендерингу форми ОНОВЛЕННЯ
  const renderDiscountUpdateForm = useCallback(
    (discount: Discount) => {
      const formDefaultValues: DiscountFormData = {
        name: discount.name,
        discount_percentage: discount.discount_percentage ?? 0, // Надаємо 0, якщо null/undefined
        start_date: formatDateForInput(discount.start_date),
        end_date: formatDateForInput(discount.end_date),
        is_active: discount.is_active ?? false,
      };
      return (
        <GenericForm<DiscountFormData>
          key={`update-form-${discount.id}`}
          defaultValues={formDefaultValues}
          fields={discountFormFields}
          onSubmit={(data) => handleUpdateSubmit(discount.id, data)}
          title={`Редагування: ${discount.name}`}
          submitLabel="Оновити знижку"
          className="border-t pt-4 mt-2 bg-gray-50 p-4 rounded"
        />
      );
    },
    [discountFormFields, handleUpdateSubmit],
  );

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління Знижками
        </h1>
        {!showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium"
          >
            + Додати Знижку
          </button>
        )}
      </div>
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          <GenericForm<DiscountFormData>
            key="create-form"
            defaultValues={createFormDefaultValues} // Використовуємо підготовлені значення
            fields={discountFormFields}
            onSubmit={handleCreateSubmit}
            title="Створення нової знижки"
            submitLabel="Створити знижку"
            className="bg-white shadow-none p-0 border-0"
          />
          <button
            onClick={() => setShowCreateForm(false)}
            className="mt-3 text-sm text-gray-600 hover:text-gray-800"
          >
            Скасувати
          </button>
        </div>
      )}

      <GenericTable<Discount>
        data={discountsRaw || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderDiscountUpdateForm}
        isLoading={isLoadingDiscounts}
        emptyMessage="Немає знижок для відображення."
      />
    </div>
  );
};
