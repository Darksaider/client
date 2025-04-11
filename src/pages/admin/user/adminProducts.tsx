import React, { useState, useCallback } from "react"; // Додано useState, useCallback
import { useFilter } from "../../../hooks/useFilter";
import { useProducts } from "../../../hooks/useProduct"; // Переконайтесь, що useProducts повертає refetch
import { ProductNew, UpdateProductNew } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "./useExpandableRows";
import { useCrudOperations } from "../../../hooks/useCrud";
import { PaginationButtons } from "../../../components/Pagination";

const initialProductValues: Partial<UpdateProductNew> = {
  // Partial робить всі поля необов'язковими
  name: "",
  description: "",
  price: "0.00",
  stock: 0,
  product_brands: undefined,
  product_categories: [],
  product_sizes: [],
  product_colors: [],
  product_tags: [],
  // Не включаємо поля тільки для читання або ті, що не редагуються в цій формі (id, sales_count, photos)
};

export const AdminProducts: React.FC = () => {
  const apiUrlBase = import.meta.env.VITE_API_URL;
  // --- Хуки ---
  const {
    data: productData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useProducts(); // Додано refetch
  const { data: filter, isLoading: filterIsLoading } = useFilter(true);
  const { expandedRows, toggleRow } = useExpandableRows<number>([]); // Додано setExpandedRows
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false); // Стан для показу форми створення
  const { createItem, updateItem, deleteItem } = useCrudOperations<
    UpdateProductNew,
    UpdateProductNew
  >({
    // <-- Оновлені типи
    resourceName: "Знижка",
    apiEndpoint: "/product",
    apiUrlBase: apiUrlBase,
    refetch: refetchProducts,
  });
  const handleUpdateSubmit = useCallback(
    async (productId: number, data: UpdateProductNew) => {
      try {
        await updateItem(productId, data);
        toggleRow(productId);
      } catch (error) {
        console.error("Помилка оновлення в компоненті:", error);
      }
    },
    [refetchProducts, toggleRow],
  ); // Додано залежності

  const handleCreateSubmit = useCallback(
    async (data: UpdateProductNew) => {
      // Приймає тип даних форми
      try {
        await createItem(data); // createItem очікує CreateDiscountPayload
        setShowCreateForm(false);
      } catch (error) {
        console.error("Помилка створення в компоненті:", error);
      }
    },
    [refetchProducts],
  ); // Додано залежності
  const handleDeleteClick = useCallback(
    (productId: number) => {
      deleteItem(productId).catch((error) => {
        console.error("Помилка видалення в компоненті:", error);
      });
    },
    [deleteItem],
  );
  const columns = [
    { header: "ID", key: "id", width: "10%" },
    {
      header: "Продукт",
      key: "product",
      width: "35%",
      render: (product: ProductNew) => (
        <div className="flex items-center">
          {product.product_photos &&
          product.product_photos.length > 0 &&
          product.product_photos[0].photo_url ? (
            <img
              className="h-10 w-10 rounded-full mr-3 object-cover"
              src={product.product_photos[0].photo_url}
              alt={product.name} // Додано alt
              onError={(e) => {
                e.currentTarget.src = "";
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center flex-shrink-0">
              {" "}
              {/* Додано flex-shrink-0 */}
              <span className="text-gray-600 font-medium">
                {product.name?.charAt(0).toUpperCase()}
              </span>{" "}
              {/* Краще стилізувати ініціали */}
            </div>
          )}
          <div className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </div>{" "}
          {/* Додано truncate */}
        </div>
      ),
    },
    {
      header: "Опис",
      key: "description",
      width: "25%",
      render: (product: ProductNew) => (
        <span className="line-clamp-2 text-sm text-gray-600">
          {product.description}
        </span>
      ),
    }, // Додано стиль опису
    {
      header: "Ціна",
      key: "price",
      width: "10%",
      render: (product: ProductNew) => (
        <span className="text-sm font-semibold">₴{product.price}</span>
      ),
    }, // Додано стиль ціни
    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (product: ProductNew) => (
        <div className="flex space-x-2">
          {" "}
          {/* Обгортка для кнопок */}
          <button
            onClick={() => toggleRow(product.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm" // Зменшено шрифт
          >
            {expandedRows.includes(product.id) ? "Згорнути" : "Редагувати"}
          </button>
          <button
            className="text-red-600 hover:text-red-900 text-sm"
            onClick={() => handleDeleteClick(product.id)}
          >
            Видалити
          </button>
        </div>
      ),
    },
  ];

  const productFormFields: FormField<UpdateProductNew>[] = [
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
      name: "description",
      label: "Опис",
      type: "text", // Можна змінити на 'textarea', якщо GenericForm підтримує
      validation: {
        required: "Опис обов'язковий",
        minLength: {
          value: 10,
          message: "Опис повинен містити мінімум 10 символів",
        }, // Збільшено мінімальну довжину
      },
    },
    {
      name: "price",
      label: "Ціна (грн)",
      type: "number",
      validation: {
        required: "Ціна обов'язкова",
        valueAsNumber: true, // Важливо для валідації числа
        min: { value: 0, message: "Ціна не може бути від'ємною" },
      },
    },
    {
      name: "stock",
      label: "Кількість на складі",
      type: "number",
      validation: {
        required: "Кількість обов'язкова", // Зроблено обов'язковим
        valueAsNumber: true,
        min: { value: 0, message: "Кількість не може бути від'ємною" },
        validate: (value) =>
          Number.isInteger(value) || "Кількість має бути цілим числом", // Тільки цілі числа
      },
    },
    {
      name: "product_brands", // Має відповідати ключу в defaultValues та UpdateProductNew
      label: "Бренд",
      type: "select",
      options:
        filter?.brands?.map((brand) => ({
          value: brand.id,
          label: brand.name,
        })) || [],
      validation: {
        required: "Бренд обов'язковий",
        // Переконуємось, що значення - число (якщо value в options - number)
        valueAsNumber: true, // Якщо value в options це числа
      },
    },
    {
      name: "product_categories",
      label: "Категорії",
      type: "checkbox-group",
      options:
        filter?.categories?.map((category) => ({
          value: category.id,
          label: category.name,
        })) || [],
      validation: { required: "Виберіть хоча б одну категорію" },
    },
    {
      name: "product_sizes",
      label: "Розміри",
      type: "checkbox-group",
      options:
        filter?.sizes?.map((size) => ({
          value: size.id,
          label: size.size,
        })) || [],
      validation: { required: "Виберіть хоча б один розмір" },
    },
    {
      name: "product_colors",
      label: "Кольори",
      type: "checkbox-group",
      options:
        filter?.colors?.map((color) => ({
          value: color.id,
          label: color.name,
        })) || [],
      validation: { required: "Виберіть хоча б один колір" },
    },
    {
      name: "product_tags",
      label: "Теги",
      type: "checkbox-group",
      options:
        filter?.tags?.map((tag) => ({
          value: tag.id,
          label: tag.name,
        })) || [], // Теги можуть бути необов'язковими
    },
  ];

  const renderProductUpdateForm = useCallback(
    (product: ProductNew) => (
      <GenericForm<UpdateProductNew>
        // Важливо: Додаємо key, щоб форма переініціалізувалася при виборі іншого продукту
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
      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          <GenericForm<UpdateProductNew> // Використовуємо той же тип форми
            // Важливо: key для можливого "скидання", якщо знадобиться
            key="create-form"
            // Передаємо об'єкт з порожніми/початковими значеннями
            defaultValues={initialProductValues as UpdateProductNew} // Приводимо тип, бо Partial
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
      <GenericTable<ProductNew> // Вказуємо тип даних для таблиці
        data={productData?.data.products || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm} // Передаємо функцію рендерингу форми оновлення
        isLoading={isLoadingProducts || filterIsLoading} // Об'єднано isLoading
        emptyMessage="Немає продуктів для відображення." // Змінено текст
      />
      <PaginationButtons
        productNumber={productData?.data.productsCourt || 0}
        isLoading={isLoadingProducts}
      />
    </div>
  );
};
