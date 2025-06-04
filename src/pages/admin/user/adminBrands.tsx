import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { Brand, CreateBrand, UpdateBrand } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "../../../hooks/useExpandableRows";
import { useBrands } from "../../../hooks/hooks";
import { useCrudOperations } from "../../../hooks/useCrud";

const initialBrandValues: Partial<UpdateBrand> = {
  name: "",
};

export const AdminBrands: React.FC = () => {
  const { data, isLoading, refetch: refetchBrands } = useBrands(true);
  const { expandedRows, toggleRow } = useExpandableRows<number>([]); // Додано setExpandedRows
  const apiUrlBase = import.meta.env.VITE_API_URL;
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // Стан для показу форми створення
  const { createItem, updateItem, deleteItem } = useCrudOperations<
    UpdateBrand,
    UpdateBrand
  >({
    // <-- Оновлені типи
    resourceName: "Знижка",
    apiEndpoint: "/brands",
    apiUrlBase: apiUrlBase,
    refetch: refetchBrands,
  });
  const handleUpdateSubmit = useCallback(
    async (brandId: number, data: UpdateBrand) => {
      try {
        await updateItem(brandId, data);
        toggleRow(brandId);
      } catch (error) {
        console.error("Помилка оновлення продукту:", error);
      }
    },
    [updateItem, toggleRow],
  );

  const handleCreateSubmit = useCallback(
    async (data: UpdateBrand) => {
      await createItem(data);
      try {
      } catch (error) {
        console.error("Помилка створення продукту:", error);
      }
    },
    [createItem],
  ); // Додано залежності
  const handleDeleteSubmit = useCallback(
    async (brandId: number) => {
      await deleteItem(brandId);
      try {
      } catch (error) {
        console.error("Помилка створення продукту:", error);
      }
    },
    [deleteItem],
  ); // Додано залежності

  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Brand",
      key: "brand",
      width: "35%",
      render: (brand: Brand) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 truncate">
            {brand.name}
          </div>
        </div>
      ),
    },
    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (brand: Brand) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleRow(brand.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(brand.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button
            onClick={() => handleDeleteSubmit(brand.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Видалити
          </button>
        </div>
      ),
    },
  ];

  const productFormFields: FormField<UpdateBrand>[] = [
    {
      name: "name",
      label: "Назва",
      type: "text",
      validation: {
        required: "Назва обов'язкова",
        minLength: {
          value: 2,
          message: "Назва повинна містити мінімум 2 символи",
        },
      },
    },
  ];
  const renderProductUpdateForm = useCallback(
    (product: Brand) => (
      <GenericForm<UpdateBrand>
        key={`update-form-${product.id}`}
        defaultValues={product} // Передаємо повний об'єкт продукту
        fields={productFormFields}
        onSubmit={(data) => handleUpdateSubmit(product.id, data)}
        title={`Редагування: ${product.name}`}
        submitLabel="Оновити"
        className="border-t pt-4 mt-2" // Додано стиль для відокремлення форми
      />
    ),
    [productFormFields, handleUpdateSubmit],
  ); // Додано залежності

  // --- Рендеринг компонента ---
  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління Брендами
        </h1>{" "}
        {!showCreateForm && ( // Показуємо кнопку тільки якщо форма створення не активна
          <button
            onClick={() => {
              setShowCreateForm(true);
              // setExpandedRows([]); // Закриваємо всі розгорнуті рядки редагування
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out" // Покращено стиль кнопки
          >
            + Додати бренд
          </button>
        )}
      </div>
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          <GenericForm<UpdateBrand> // Використовуємо той же тип форми
            key="create-form"
            // Передаємо об'єкт з порожніми/початковими значеннями
            defaultValues={initialBrandValues as UpdateBrand} // Приводимо тип, бо Partial
            fields={productFormFields}
            onSubmit={handleCreateSubmit} // Викликаємо обробник створення
            title="Створення нового продукту"
            submitLabel="Створити продукт"
            className="bg-white shadow-none p-0 border-0" // Прибрано зайві стилі GenericForm
          />
          <button
            onClick={() => setShowCreateForm(false)}
            className="mt-3 text-sm text-gray-600 hover:text-gray-800"
          >
            Скасувати
          </button>
        </div>
      )}
      <GenericTable<Brand> // Вказуємо тип даних для таблиці
        data={data || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={isLoading} // Об'єднано isLoading
        emptyMessage="Немає брендів для відображення." // Змінено текст
      />
    </div>
  );
};
