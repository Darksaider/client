import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { useFilter } from "../../../hooks/useFilter";
import { useProducts } from "../../../hooks/useProduct"; // Переконайтесь, що useProducts повертає refetch
import { Color, UpdateColor } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "./useExpandableRows";
import axios from "axios";

const initialColorValues: Partial<UpdateColor> = {
  name: "",
  hex_code: "",
};

export const AdminColor: React.FC = () => {
  // --- Хуки ---
  const {
    data: productResponse,
    isLoading,
    refetch: refetchProducts,
  } = useProducts();
  const { data: filter, isLoading: filterIsLoading } = useFilter(true);
  const { expandedRows, toggleRow } = useExpandableRows<number>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleUpdateSubmit = useCallback(
    async (brandId: number, data: UpdateColor) => {
      console.log(`Оновлення кольору з ID ${brandId}:`, data);
      // Тут ваш API виклик для ОНОВЛЕННЯ
      try {
        // await api.updateProduct(productId, data); // Замініть на
        // реальний виклик
        const apiUrl = `http://localhost:3000/brand/${brandId}`;
        const response = await axios.put(apiUrl, data, {});
        alert(`Колір ${data.name} успішно оновлено!`);
        toggleRow(brandId); // Згорнути рядок
        if (refetchProducts) {
          refetchProducts(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка оновлення кольору:", error);
        alert("Помилка оновлення кольору");
      }
    },
    [refetchProducts, toggleRow],
  ); // Додано залежності

  const handleCreateSubmit = useCallback(
    async (data: UpdateColor) => {
      // Приймає тип даних форми
      console.log("Створення нового кольору:", data);
      // Тут ваш API виклик для СТВОРЕННЯ
      try {
        const apiUrl = "http://localhost:3000/brand";
        const response = await axios.post(apiUrl, data, {});

        alert(`Продукт ${data.name} успішно створено!`);
        setShowCreateForm(false);
        console.log(response.data);

        if (refetchProducts) {
          refetchProducts(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка створення кольору:", error);
        alert("Помилка створення кольору");
      }
    },
    [refetchProducts],
  ); // Додано залежності

  // --- Визначення колонок таблиці ---
  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Color",
      key: "color",
      width: "35%",
      render: (color: Color) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 truncate">
            {color.name}
          </div>{" "}
          {/* Додано truncate */}
        </div>
      ),
    },
    {
      header: "Hex-code",
      key: "hexCode",
      width: "35%",
      render: (Color: Color) => (
        <div className="flex items-center">
          <div
            style={{ background: `${Color.hex_code}` }}
            className="text-sm font-medium text-gray-900 truncate"
          >
            {Color.hex_code}
          </div>{" "}
          {/* Додано truncate */}
        </div>
      ),
    },
    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (color: Color) => (
        <div className="flex space-x-2">
          {" "}
          {/* Обгортка для кнопок */}
          <button
            onClick={() => toggleRow(color.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(color.id) ? "Згорнути" : "Редагувати"}
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

  const productFormFields: FormField<UpdateColor>[] = [
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
    {
      name: "hex_code",
      label: "Hex Code",
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
    (color: Color) => (
      <GenericForm<UpdateColor>
        key={`update-form-${color.id}`}
        defaultValues={color} // Передаємо повний об'єкт кольору
        fields={productFormFields}
        onSubmit={(data) => handleUpdateSubmit(color.id, data)}
        title={`Редагування: ${color.name}`}
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
          Управління продуктами
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
            + Додати продукт
          </button>
        )}
      </div>
      {/* --- Форма СТВОРЕННЯ (якщо активна) --- */}
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          {" "}
          {/* Змінено стиль обгортки */}
          <GenericForm<UpdateColor>
            key="create-form"
            fields={productFormFields}
            onSubmit={handleCreateSubmit}
            defaultValues={initialColorValues as UpdateColor}
            title="Створення нового кольору"
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
      <GenericTable<Color> // Вказуємо тип даних для таблиці
        data={filter?.colors || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={isLoading || filterIsLoading} // Об'єднано isLoading
        emptyMessage="Немає продуктів для відображення." // Змінено текст
      />
    </div>
  );
};
