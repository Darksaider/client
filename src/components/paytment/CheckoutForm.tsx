// src/components/CheckoutForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { CartItem, createOrder, OrderFormData } from "./orderApi";
import { NovaPoshtaBranchSelector } from "../../pages/client/novapost";

interface CheckoutFormProps {
  cartItems: CartItem[];
  userId: number;
  onOrderCreated?: (orderId: number) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cartItems,
  userId,
  onOrderCreated,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      paymentMethod: "card",
      notes: "",
    },
  });

  // Розрахунок загальної суми замовлення
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Відправка форми
  const onSubmit = async (formData: OrderFormData) => {
    // Перевірка наявності товарів у кошику
    if (cartItems.length === 0) {
      setError("Ваш кошик порожній");
      return;
    }

    if (!formData.city || !formData.address) {
      setError("Будь ласка, виберіть місто та відділення Нової Пошти");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createOrder(userId, cartItems, formData);

      localStorage.setItem("currentOrderId", response.orderId.toString());

      if (onOrderCreated) {
        onOrderCreated(response.orderId);
      }

      navigate(`/checkout/payment/${response.orderId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Не вдалося створити замовлення");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white  rounded-lg overflow-hidden ">
      <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600">
        <p className="text-indigo-100 mt-1">
          Заповніть форму для завершення покупки
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-4">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" grid gap-6">
          <div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Особиста інформація
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Ім'я*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    {...register("firstName", { required: "Вкажіть ім'я" })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Прізвище*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    {...register("lastName", { required: "Вкажіть прізвище" })}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    {...register("email", {
                      required: "Вкажіть електронну пошту",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Невірний формат електронної пошти",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Телефон*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="+380"
                    {...register("phone", {
                      required: "Вкажіть номер телефону",
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Додаткова інформація */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center mb-4 pb-2 border-b">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Додаткова інформація
                </h3>
              </div>

              <div className="form-group">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Примітки до замовлення
                </label>
                <textarea
                  id="notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Додаткові побажання або коментарі до замовлення"
                  rows={4}
                  {...register("notes")}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Спосіб оплати
                </label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      id="payment-card"
                      type="radio"
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                      value="card"
                      {...register("paymentMethod")}
                      defaultChecked
                    />
                    <label
                      htmlFor="payment-card"
                      className="ml-3 text-sm text-gray-700"
                    >
                      Оплата карткою
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="payment-cash"
                      type="radio"
                      className="h-4 w-4 text-indigo-600 border-gray-300"
                      value="cash"
                      {...register("paymentMethod")}
                    />
                    <label
                      htmlFor="payment-cash"
                      className="ml-3 text-sm text-gray-700"
                    >
                      Готівкою при отриманні
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Нижній ряд: доставка */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center mb-4 pb-2 border-b">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H13a1 1 0 001-1v-5h2a1 1 0 00.96-.68l1.65-3.67A1 1 0 0018 4H3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Доставка Новою Поштою
              </h3>
            </div>
            <NovaPoshtaBranchSelector
              register={register}
              control={control}
              setValue={setValue}
            />
          </div>

          {/* Підсумок замовлення */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg shadow-sm mt-2">
            <div className="flex items-center mb-4 pb-2 border-b border-indigo-100">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Підсумок замовлення
              </h3>
            </div>

            <div className="space-y-4">
              {cartItems.length > 0 ? (
                <div className="bg-white p-4 rounded-md shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-600 text-sm">
                          Товар
                        </th>
                        <th className="text-center py-2 text-gray-600 text-sm">
                          Кількість
                        </th>
                        <th className="text-right py-2 text-gray-600 text-sm">
                          Ціна
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-3 text-gray-800">{item.name}</td>
                          <td className="py-3 text-center text-gray-800">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right text-gray-800">
                            {(item.price * item.quantity).toFixed(2)} грн
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Ваш кошик порожній
                </div>
              )}

              <div className="bg-white p-4 rounded-md shadow-sm">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Товарів у кошику:</span>
                  <span className="font-medium">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 text-lg font-semibold">
                  <span>Загальна сума:</span>
                  <span className="text-indigo-600">
                    {calculateTotal().toFixed(2)} грн
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full mt-6 py-3 px-4 ${
                loading || cartItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              } text-white font-bold rounded-md shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5`}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Обробка...
                </span>
              ) : (
                "Підтвердити замовлення"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
