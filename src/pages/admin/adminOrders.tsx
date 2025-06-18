import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import apiClient from "../../hooks/apiClient";
import { useQuery } from "@tanstack/react-query";

type Color = {
  id: number;
  name: string;
  hexCode: string;
};

type Size = {
  id: number;
  size: string;
};

type ProductItem = {
  id: number;
  productId: number;
  quantity: number;
  price: string;
  selectedColor: Color;
  selectedSize: Size;
  product: {
    id: number;
    name: string;
    colors: Color[];
    sizes: Size[];
  };
};

type OrderFormData = {
  status: string;
  shippingAddress: string;
  paymentMethod: string;
  items: {
    id: number;
    quantity: number;
    selectedColorId: number;
    selectedSizeId: number;
  }[];
};

type Props = {
  initialData: {
    id: number;
    status: string;
    shippingAddress: string;
    paymentMethod: string;
    items: ProductItem[];
  };
  onSubmit: (data: OrderFormData) => void;
};

const getDataOrder = async () => {
  try {
    const response = await apiClient.get("ordersAll");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export function useOrders(isEnabled: boolean) {
  const { data, isError, isLoading, isSuccess, refetch } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: () => getDataOrder(),
    select: (data) => data,
    enabled: isEnabled,
  });

  useEffect(() => {
    if (isError) console.log("Error fetching data");
  }, [isError]);

  return {
    data,
    isError,
    isLoading,
    isSuccess,
    refetch,
  };
}

const statusOptions = [
  {
    value: "pending",
    label: "Очікується",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "processing",
    label: "Обробляється",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "completed",
    label: "Завершено",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Скасовано", color: "bg-red-100 text-red-800" },
];

const paymentOptions = [
  { value: "card", label: "Картка" },
  { value: "cash", label: "Готівка" },
  { value: "paypal", label: "PayPal" },
];

const getStatusColor = (status: string) => {
  const statusOption = statusOptions.find((option) => option.value === status);
  return statusOption ? statusOption.color : "bg-gray-100 text-gray-800";
};

export const OrderUpdateForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const { control, register, handleSubmit, reset } = useForm<OrderFormData>();

  useEffect(() => {
    if (initialData) {
      reset({
        status: initialData.status,
        shippingAddress: initialData.shippingAddress,
        paymentMethod: initialData.paymentMethod,
        items: initialData.items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          selectedColorId: item.selectedColor.id,
          selectedSizeId: item.selectedSize.id,
        })),
      });
    }
  }, [initialData, reset]);

  if (!initialData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Завантаження форми...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Основна інформація замовлення */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Статус замовлення
            </label>
            <select
              {...register("status")}
              id="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="paymentMethod"
              className="block text-sm font-medium text-gray-700"
            >
              Спосіб оплати
            </label>
            <select
              {...register("paymentMethod")}
              id="paymentMethod"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              {paymentOptions.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <span className="block text-sm font-medium text-gray-700">
              Поточний статус
            </span>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(initialData.status)}`}
            >
              {statusOptions.find((s) => s.value === initialData.status)
                ?.label || initialData.status}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="shippingAddress"
            className="block text-sm font-medium text-gray-700"
          >
            Адреса доставки
          </label>
          <textarea
            id="shippingAddress"
            {...register("shippingAddress")}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Введіть повну адресу доставки..."
          />
        </div>

        {/* Товари */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Товари в замовленні
          </h4>

          <div className="space-y-4">
            {initialData.items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {item.product.name}
                    </h5>
                    <p className="text-lg font-bold text-green-600">
                      {item.price} грн
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.selectedColor.hexCode }}
                      title={item.selectedColor.name}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {item.selectedSize.size}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Кількість
                    </label>
                    <input
                      type="number"
                      min={1}
                      {...register(`items.${idx}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Колір
                    </label>
                    <Controller
                      name={`items.${idx}.selectedColorId`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {item.product.colors.map((color) => (
                            <option key={color.id} value={color.id}>
                              {color.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Розмір
                    </label>
                    <Controller
                      name={`items.${idx}.selectedSizeId`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          {item.product.sizes.map((size) => (
                            <option key={size.id} value={size.id}>
                              {size.size}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Оновити замовлення
          </button>
        </div>
      </form>
    </div>
  );
};

export const AdminOrders = () => {
  const { data, isLoading, isError } = useOrders(true);

  const handleUpdate = (formData: OrderFormData) => {
    console.log("Оновлені дані замовлення", formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження замовлень...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 text-lg font-medium mb-2">
            Помилка завантаження
          </div>
          <p className="text-red-600">
            Не вдалося завантажити замовлення. Спробуйте оновити сторінку.
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
          <div className="text-gray-600 text-lg font-medium mb-2">
            Замовлення не знайдено
          </div>
          <p className="text-gray-500">
            На даний момент немає замовлень для відображення
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Управління замовленнями
        </h1>
        <p className="text-gray-600">Перегляд та редагування замовлень</p>
      </div>

      <div className="grid gap-8">
        {data.map((order: any) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  Замовлення #{order.id}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                >
                  {statusOptions.find((s) => s.value === order.status)?.label ||
                    order.status}
                </span>
              </div>
            </div>
            <div className="p-6">
              <OrderUpdateForm initialData={order} onSubmit={handleUpdate} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
