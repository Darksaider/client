import React, { useState, useCallback } from "react";
import { useFilter } from "../../../hooks/useFilter";
import { useProducts } from "../../../hooks/useProduct";
import { ProductNew, UpdateProductNew } from "../admin.type";
import { FormField, GenericForm } from "./GenericForm";
import { GenericTable } from "./GenericTable";
import { useExpandableRows } from "./useExpandableRows";
import { useCrudOperations } from "../../../hooks/useCrud";
import { PaginationButtons } from "../../../components/Pagination";

// Початкові значення для нового продукту
const initialProductValues: Partial<UpdateProductNew> = {
  name: "",
  description: "",
  price: "0.00",
  stock: 0,
  product_brands: undefined,
  product_categories: [],
  product_sizes: [],
  product_colors: [],
  product_tags: [],
  product_photos: [],
  product_discounts: undefined,
};

export const AdminProducts: React.FC = () => {
  const apiUrlBase = import.meta.env.VITE_API_URL;

  // --- Хуки ---
  const {
    data: productData,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useProducts();

  const { data: filter, isLoading: filterIsLoading } = useFilter(true);

  const { expandedRows, toggleRow } = useExpandableRows<number>([]);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);

  // Модифікована функція для операцій CRUD, яка обробляє FormData
  const { createItem, updateItem, deleteItem } = useCrudOperations<
    FormData,
    FormData
  >({
    resourceName: "Продукт",
    apiEndpoint: "/newproducts",
    apiUrlBase: apiUrlBase,
    refetch: refetchProducts,
  });

  // Функція для підготовки FormData з усіма даними
  const prepareFormData = (data: UpdateProductNew) => {
    const formData = new FormData();

    const productData = {
      name: data.name || "",
      description: data.description || "",
      price: data.price?.toString() || "0",
      stock: data.stock || 0,
      product_brands: data.product_brands,
      product_categories: data.product_categories || [],
      product_sizes: data.product_sizes || [],
      product_colors: data.product_colors || [],
      product_tags: data.product_tags || [],
      product_discounts: data.product_discounts,
    };

    formData.append("productData", JSON.stringify(productData));

    if (
      data.product_photos &&
      typeof data.product_photos === "object" &&
      (data.product_photos as any).imagesToDelete?.length > 0
    ) {
      formData.append(
        "photos_to_delete",
        JSON.stringify((data.product_photos as any).imagesToDelete),
      );
    }

    // Додаємо файли зображень
    if (
      data.product_photos &&
      typeof data.product_photos === "object" &&
      (data.product_photos as any).newFiles?.length > 0
    ) {
      const newFiles = (data.product_photos as any).newFiles;
      for (let i = 0; i < newFiles.length; i++) {
        formData.append("new_photos", newFiles[i]);
      }
    }

    return formData;
  };

  const handleUpdateSubmit = useCallback(
    async (productId: number, data: UpdateProductNew) => {
      try {
        // Готуємо FormData з усіма даними
        const formData = prepareFormData(data);

        // Оновлюємо продукт одним запитом
        const response = await updateItem(productId, formData);
        console.log("Продукт успішно оновлено:", response);

        // Перезавантажуємо дані і згортаємо рядок
        refetchProducts();
        toggleRow(productId);
      } catch (error) {
        console.error("Помилка оновлення продукту:", error);
      }
    },
    [updateItem, toggleRow, refetchProducts],
  );

  // Обробник відправки форми створення
  const handleCreateSubmit = useCallback(
    async (data: UpdateProductNew) => {
      try {
        // Готуємо FormData з усіма даними
        const formData = prepareFormData(data);

        // Створюємо продукт одним запитом
        const response = await createItem(formData);
        console.log("Продукт успішно створено:", response);

        // Перезавантажуємо дані і ховаємо форму
        refetchProducts();
        setShowCreateForm(false);
      } catch (error) {
        console.error("Помилка створення продукту:", error);
      }
    },
    [createItem, refetchProducts],
  );

  // Обробник видалення продукту
  const handleDeleteClick = useCallback(
    (productId: number) => {
      deleteItem(productId).catch((error) => {
        console.error("Помилка видалення продукту:", error);
      });
    },
    [deleteItem],
  );

  // Визначення колонок для таблиці (без змін)
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
              alt={product.name}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center flex-shrink-0">
              <span className="text-gray-600 font-medium">
                {product.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </div>
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
    },
    {
      header: "Ціна",
      key: "price",
      width: "10%",
      render: (product: ProductNew) => (
        <span className="text-sm font-semibold">₴{product.price}</span>
      ),
    },
    {
      header: "Дії",
      key: "actions",
      width: "15%",
      render: (product: ProductNew) => (
        <div className="flex space-x-2">
          <button
            onClick={() => toggleRow(product.id)}
            className="text-indigo-600 hover:text-indigo-900 text-sm"
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

  // Базовий набір полів форми для продукту (без змін)
  const getBaseProductFormFields = (): FormField<UpdateProductNew>[] => [
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
      type: "text",
      validation: {
        required: "Опис обов'язковий",
        minLength: {
          value: 10,
          message: "Опис повинен містити мінімум 10 символів",
        },
      },
    },
    {
      name: "price",
      label: "Ціна (грн)",
      type: "number",
      validation: {
        required: "Ціна обов'язкова",
        valueAsNumber: true,
        min: { value: 0, message: "Ціна не може бути від'ємною" },
      },
    },
    {
      name: "stock",
      label: "Кількість на складі",
      type: "number",
      validation: {
        required: "Кількість обов'язкова",
        valueAsNumber: true,
        min: { value: 0, message: "Кількість не може бути від'ємною" },
        validate: (value) =>
          Number.isInteger(value) || "Кількість має бути цілим числом",
      },
    },
    {
      name: "product_brands",
      label: "Бренд",
      type: "select",
      options:
        filter?.brands?.map((brand) => ({
          value: brand.id,
          label: brand.name,
        })) || [],
      validation: {
        required: "Бренд обов'язковий",
        valueAsNumber: true,
      },
    },
    {
      name: "product_discounts",
      label: "Знижки",
      type: "select",
      options:
        filter?.discounts?.map((discounts) => ({
          value: discounts.id,
          label: discounts.name,
        })) || [],
      validation: {
        valueAsNumber: true,
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
        })) || [],
    },
  ];

  // Поле для завантаження фото - для форми створення нового продукту
  const photoFieldForCreate: FormField<UpdateProductNew> = {
    name: "product_photos",
    label: "Фотографії продукту",
    type: "file",
    multiple: true,
    accept: "image/*",
    validation: {
      required: "Додайте хоча б одне фото продукту",
    },
  };

  const createFormFields = useCallback(() => {
    return [...getBaseProductFormFields(), photoFieldForCreate];
  }, [filter]);

  // Форма редагування продукту
  const renderProductUpdateForm = useCallback(
    (product: ProductNew) => {
      // Отримуємо базові поля форми
      const fieldsWithPhotos = [...getBaseProductFormFields()];

      fieldsWithPhotos.push({
        name: "product_photos",
        label: "Фотографії продукту",
        type: "file",
        multiple: true,
        accept: "image/*",
        existingImages:
          product.product_photos?.map((photo) => ({
            id: photo.cloudinary_public_id,
            cloudinary_public_id: photo.cloudinary_public_id,
            url: photo.photo_url,
            name: `Фото ${photo.id}`,
          })) || [],
      });

      return (
        <GenericForm<UpdateProductNew>
          key={`update-form-${product.id}`}
          defaultValues={product}
          fields={fieldsWithPhotos}
          onSubmit={(data) => handleUpdateSubmit(product.id, data)}
          title={`Редагування: ${product.name}`}
          submitLabel="Оновити"
          className="border-t pt-4 mt-2"
        />
      );
    },
    [filter, handleUpdateSubmit],
  );

  return (
    <div className="p-4 mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Управління продуктами
        </h1>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out"
          >
            + Додати продукт
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6 border p-4 rounded-lg bg-white shadow-md">
          <GenericForm<UpdateProductNew>
            key="create-form"
            defaultValues={initialProductValues as UpdateProductNew}
            fields={createFormFields()}
            onSubmit={handleCreateSubmit}
            title="Створення нового продукту"
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

      <GenericTable<ProductNew>
        data={productData?.data.products || []}
        columns={columns}
        keyField="id"
        expandedRows={expandedRows}
        onRowToggle={toggleRow}
        renderExpandedContent={renderProductUpdateForm}
        isLoading={isLoadingProducts || filterIsLoading}
        emptyMessage="Немає продуктів для відображення."
      />

      <PaginationButtons
        productNumber={productData?.data.productsCourt || 0}
        isLoading={isLoadingProducts}
      />
    </div>
  );
};
