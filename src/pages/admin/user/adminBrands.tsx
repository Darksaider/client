import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { useFilter } from "../../../hooks/useFilter";
import { useProducts } from "../../../hooks/useProduct"; // Переконайтесь, що useProducts повертає refetch
import { Brand, UpdateBrand } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "./useExpandableRows";
import axios from "axios";

const initialBrandValues: Partial<UpdateBrand> = {
  name: "",
};

export const AdminBrands: React.FC = () => {
  // --- Хуки ---
  const {
    data: productResponse,
    isLoading,
    refetch: refetchProducts,
  } = useProducts(); // Додано refetch
  const { data: filter, isLoading: filterIsLoading } = useFilter(true);
  const { expandedRows, toggleRow } = useExpandableRows<number>([]); // Додано setExpandedRows
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // Стан для показу форми створення

  // --- Обробники Submit ---
  const handleUpdateSubmit = useCallback(
    async (brandId: number, data: UpdateBrand) => {
      console.log(`Оновлення бренду з ID ${brandId}:`, data);
      try {
        const apiUrl = `http://localhost:3000/brand/${brandId}`;
        const response = await axios.put(apiUrl, data, {});
        alert(`Продукт ${data.name} успішно оновлено!`);
        toggleRow(brandId); // Згорнути рядок
        if (refetchProducts) {
          refetchProducts(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка оновлення продукту:", error);
        alert("Помилка оновлення продукту");
      }
    },
    [refetchProducts, toggleRow],
  ); // Додано залежності

  const handleCreateSubmit = useCallback(
    async (data: UpdateBrand) => {
      // Приймає тип даних форми
      console.log("Створення нового продукту:", data);
      // Тут ваш API виклик для СТВОРЕННЯ
      try {
        const apiUrl = "http://localhost:3000/brands";
        const response = await axios.post(apiUrl, data, {
          withCredentials: true,
        });

        alert(`Продукт ${data.name} успішно створено!`);
        setShowCreateForm(false);
        console.log(response.data);

        if (refetchProducts) {
          refetchProducts(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка створення продукту:", error);
        alert("Помилка створення бренду");
      }
    },
    [refetchProducts],
  ); // Додано залежності

  // --- Визначення колонок таблиці ---
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
          </div>{" "}
          {/* Додано truncate */}
        </div>
      ),
    },
    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (brand: Brand) => (
        <div className="flex space-x-2">
          {" "}
          {/* Обгортка для кнопок */}
          <button
            onClick={() => toggleRow(brand.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(brand.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button className="text-red-600 hover:text-red-900 text-sm">
            {" "}
            {/* Додайте onClick для видалення */}
            Видалити
          </button>
        </div>
      ),
    },
  ];

  // --- Визначення полів форми ---
  // Важливо: Тип тепер <UpdateProductNew>, бо ми використовуємо його для обох сценаріїв
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
      {" "}
      {/* Обмежено ширину */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління Брендами
        </h1>{" "}
        {/* Змінено колір */}
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
        data={filter?.brands || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={isLoading || filterIsLoading} // Об'єднано isLoading
        emptyMessage="Немає брендів для відображення." // Змінено текст
      />
    </div>
  );
};
