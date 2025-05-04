import React, { useState, useCallback } from "react";
import { Category, UpdateCategory } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "./useExpandableRows";
import { useCategories } from "./hooks";
import { useCrudOperations } from "../../../hooks/useCrud";

const initialBrandValues: Partial<UpdateCategory> = {
  name: "",
};

export const AdminCategories: React.FC = () => {
  const apiUrlBase = import.meta.env.VITE_API_URL;
  const {
    data: categoriesData,
    refetch: refetchCategories,
    isLoading,
  } = useCategories(true);
  const { createItem, updateItem, deleteItem } = useCrudOperations<
    Partial<UpdateCategory>,
    UpdateCategory
  >({
    // <-- Оновлені типи
    resourceName: "Знижка",
    apiEndpoint: "/categories",
    apiUrlBase: apiUrlBase,
    refetch: refetchCategories,
  });
  const { expandedRows, toggleRow } = useExpandableRows<number>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleUpdateSubmit = useCallback(
    async (brandId: number, data: UpdateCategory) => {
      try {
        await updateItem(brandId, data);
      } catch (error) {
        console.error("Помилка оновлення в компоненті:", error);
      }
    },
    [updateItem, toggleRow],
  );

  const handleCreateSubmit = useCallback(
    async (data: Partial<UpdateCategory>) => {
      try {
        await createItem(data);
        setShowCreateForm(false);
      } catch (error) {
        console.error("Помилка створення категорії:", error);
      }
    },
    [createItem],
  );

  const handleDeleteClick = useCallback(
    async (brandId: number) => {
      try {
        await deleteItem(brandId);
      } catch (error) {
        console.error("Помилка створення категорії:", error);
      }
    },
    [deleteItem],
  );

  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Назва",
      key: "brand",
      width: "35%",
      render: (brand: Category) => (
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
      render: (category: Category) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleRow(category.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(category.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button
            onClick={() => handleDeleteClick(category.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
            Видалити
          </button>
        </div>
      ),
    },
  ];
  const productFormFields: FormField<UpdateCategory>[] = [
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
    (product: Category) => (
      <GenericForm<UpdateCategory>
        key={`update-form-${product.id}`}
        defaultValues={product}
        fields={productFormFields}
        onSubmit={(data) => handleUpdateSubmit(product.id, data)}
        title={`Редагування: ${product.name}`}
        submitLabel="Оновити"
        className="border-t pt-4 mt-2"
      />
    ),
    [productFormFields, handleUpdateSubmit],
  );

  return (
    <div className="p-4 mx-auto max-w-7xl">
      {" "}
      {/* Обмежено ширину */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління Категоріями
        </h1>
        {!showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              // setExpandedRows([]); // Закриваємо всі розгорнуті рядки редагування
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out" // Покращено стиль кнопки
          >
            + Додати категорію
          </button>
        )}
      </div>
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          <GenericForm<UpdateCategory>
            key="create-form"
            defaultValues={initialBrandValues as UpdateCategory}
            fields={productFormFields}
            onSubmit={handleCreateSubmit}
            title="Створення нової категорії"
            submitLabel="Створити продукт"
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
      <GenericTable<Category>
        data={categoriesData || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={isLoading} // Об'єднано isLoading
        emptyMessage="Немає категорій  для відображення." // Змінено текст
      />
    </div>
  );
};
