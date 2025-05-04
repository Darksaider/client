import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { useFilter } from "../../../hooks/useFilter";
import { useProducts } from "../../../hooks/useProduct"; // Переконайтесь, що useProducts повертає refetch
import { Tag, UpdateTag } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "./useExpandableRows";
import axios from "axios";

const initialnameValues: Partial<UpdateTag> = {
  name: "",
};

export const AdminTags: React.FC = () => {
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
    async (nameId: number, data: UpdateTag) => {
      console.log(`Оновлення тегу з ID ${nameId}:`, data);
      try {
        const apiUrl = `http://localhost:3000/tags/${nameId}`;
        const response = await axios.put(apiUrl, data, {});
        alert(`Колір ${data.name} успішно оновлено!`);
        toggleRow(nameId); // Згорнути рядок
        if (refetchProducts) {
          refetchProducts(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка оновлення тегу:", error);
        alert("Помилка оновлення тегу");
      }
    },
    [refetchProducts, toggleRow],
  ); // Додано залежності

  const handleCreateSubmit = useCallback(
    async (data: UpdateTag) => {
      console.log("Створення нового тегу:", data);
      try {
        const apiUrl = "http://localhost:3000/tags";
        const response = await axios.post(apiUrl, data, {});

        alert(`Тег ${data.name} успішно створено!`);
        setShowCreateForm(false);
        console.log(response.data);

        if (refetchProducts) {
          refetchProducts(); // Оновити таблицю
        }
      } catch (error) {
        console.error("Помилка створення тегу:", error);
        alert("Помилка створення тегу");
      }
    },
    [refetchProducts],
  ); // Додано залежності

  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Назва",
      key: "name",
      width: "35%",
      render: (item: Tag) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 truncate">
            {item.name}
          </div>
        </div>
      ),
    },

    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (name: Tag) => (
        <div className="flex space-x-2">
          {" "}
          {/* Обгортка для кнопок */}
          <button
            onClick={() => toggleRow(name.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(name.id) ? "Згорнути" : "Редагувати"}
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

  const productFormFields: FormField<UpdateTag>[] = [
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
    (item: Tag) => (
      <GenericForm<UpdateTag>
        key={`update-form-${item.id}`}
        defaultValues={item} // Передаємо повний об'єкт тегу
        fields={productFormFields}
        onSubmit={(data) => handleUpdateSubmit(item.id, data)}
        title={`Редагування: ${item.name}`}
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
            + Додати тег
          </button>
        )}
      </div>
      {/* --- Форма СТВОРЕННЯ (якщо активна) --- */}
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          {" "}
          {/* Змінено стиль обгортки */}
          <GenericForm<UpdateTag>
            key="create-form"
            fields={productFormFields}
            onSubmit={handleCreateSubmit}
            defaultValues={initialnameValues as UpdateTag}
            title="Створення нового тегу"
            submitLabel="Створити тег"
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
      <GenericTable<Tag>
        data={filter?.tags || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={isLoading || filterIsLoading} // Об'єднано isLoading
        emptyMessage="Немає кольорів для відображення." // Змінено текст
      />
    </div>
  );
};
