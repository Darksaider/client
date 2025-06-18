import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { Color, UpdateColor } from "./admin.type";
import { useExpandableRows } from "../../hooks/useExpandableRows";
import { useColors } from "../../hooks/hooks";
import { useCrudOperations } from "../../hooks/useCrud";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import toast from "react-hot-toast";

const initialColorValues: Partial<UpdateColor> = {
  name: "",
  hex_code: "",
};

export const AdminColor: React.FC = () => {
  const {
    data: colors,
    isLoading: colorsIsLoading,
    refetch: refetchColors,
  } = useColors(true);
  const { createItem, updateItem, deleteItem } = useCrudOperations<
    Partial<Color>,
    UpdateColor
  >({
    resourceName: "Колір",
    apiEndpoint: "/colors",
    apiUrlBase: import.meta.env.VITE_API_URL,
    refetch: refetchColors,
  });
  const { expandedRows, toggleRow } = useExpandableRows<number>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  const handleUpdateSubmit = useCallback(
    async (brandId: number, data: UpdateColor) => {
      try {
        await updateItem(brandId, data);
        toggleRow(brandId); // Згорнути рядок
      } catch (error) {
        console.error("Помилка оновлення кольору:", error);
        toast.error("Помилка оновлення кольору");
      }
    },
    [updateItem, toggleRow],
  ); // Додано залежності

  const handleCreateSubmit = useCallback(
    async (data: UpdateColor) => {
      try {
        await createItem(data);
        setShowCreateForm(false);
      } catch (error) {}
    },
    [refetchColors, setShowCreateForm],
  ); // Додано залежності
  const handleDeleteClick = useCallback(
    async (colorId: number) => {
      try {
        await deleteItem(colorId);
      } catch (error) {
        console.error("Помилка видалення  кольору:", error);
      }
    },
    [deleteItem],
  );
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
          </div>
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
          </div>
        </div>
      ),
    },
    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (color: Color) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleRow(color.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(color.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button
            onClick={() => handleDeleteClick(color.id)}
            className="text-red-600 hover:text-red-900 text-sm"
          >
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
        data={colors || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={colorsIsLoading} // Об'єднано isLoading
        emptyMessage="Немає продуктів для відображення." // Змінено текст
      />
    </div>
  );
};
