import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { Size, UpdateSize } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "../../../hooks/useExpandableRows";
import axios from "axios";
import { useSizes } from "../../../hooks/hooks";

const initialSizeValues: Partial<UpdateSize> = {
  size: "",
};

export const AdminSizes: React.FC = () => {
  // --- Хуки ---
  const {
    data: dataSizes,
    isLoading: sizesIsLoading,
    refetch: refetchSizes,
  } = useSizes(true);
  const { expandedRows, toggleRow } = useExpandableRows<number>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleUpdateSubmit = useCallback(
    async (sizeId: number, data: UpdateSize) => {
      console.log(`Оновлення розміру з ID ${sizeId}:`, data);
      // Тут ваш API виклик для ОНОВЛЕННЯ
      try {
        const apiUrl = `http://localhost:3000/sizes/${sizeId}`;
        await axios.put(apiUrl, { size: data.size }, {});
        alert(`Колір ${data.size} успішно оновлено!`);
        toggleRow(sizeId); // Згорнути рядок
        if (refetchSizes) {
          refetchSizes(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка оновлення розміру:", error);
        alert("Помилка оновлення розміру");
      }
    },
    [refetchSizes, toggleRow],
  ); // Додано залежності

  const handleCreateSubmit = useCallback(
    async (data: UpdateSize) => {
      // Приймає тип даних форми
      console.log("Створення нового розміру:", data);
      // Тут ваш API виклик для СТВОРЕННЯ
      try {
        const apiUrl = "http://localhost:3000/sizes";
        const response = await axios.post(apiUrl, data, {});

        alert(`Продукт ${data.size} успішно створено!`);
        setShowCreateForm(false);
        console.log(response.data);

        if (refetchSizes) {
          refetchSizes(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка створення розміру:", error);
        alert("Помилка створення розміру");
      }
    },
    [refetchSizes],
  ); // Додано залежності

  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Size",
      key: "Size",
      width: "35%",
      render: (item: Size) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 truncate">
            {item.size}
          </div>
        </div>
      ),
    },

    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (Size: Size) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleRow(Size.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(Size.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button className="text-red-600 hover:text-red-900 text-sm">
            Видалити
          </button>
        </div>
      ),
    },
  ];

  const productFormFields: FormField<UpdateSize>[] = [
    {
      name: "size",
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
    (item: Size) => (
      <GenericForm<UpdateSize>
        key={`update-form-${item.id}`}
        defaultValues={item} // Передаємо повний об'єкт розміру
        fields={productFormFields}
        onSubmit={(data) => handleUpdateSubmit(item.id, data)}
        title={`Редагування: ${item.size}`}
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
          <GenericForm<UpdateSize>
            key="create-form"
            fields={productFormFields}
            onSubmit={handleCreateSubmit}
            defaultValues={initialSizeValues as UpdateSize}
            title="Створення нового розміру"
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
      <GenericTable<Size>
        data={dataSizes || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={sizesIsLoading} // Об'єднано isLoading
        emptyMessage="Немає кольорів для відображення." // Змінено текст
      />
    </div>
  );
};
