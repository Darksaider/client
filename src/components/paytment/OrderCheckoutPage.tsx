import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import CheckoutButton from "./CheckoutButton";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  products: {
    name: string;
    description: string | null;
  };
}

interface Order {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  payment_status: string | null;
  created_at: string;
  order_items: OrderItem[];
}

export const OrderCheckoutPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Замініть на актуальний ID користувача з вашої системи авторизації
  const userId = 2; // Приклад: Отримайте з контексту авторизації або localStorage

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${API_URL}/order/${orderId}`);
        setOrder(response.data);
        // Зберігаємо orderId в localStorage для використання на сторінці успішної оплати
        localStorage.setItem("currentOrderId", orderId || "");
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Не вдалося завантажити замовлення",
        );
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="loading-spinner"></div>
        <span className="ml-3 text-lg font-medium text-gray-700">
          Завантаження замовлення...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Помилка</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Повернутися до замовлень
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Замовлення не знайдено
          </h2>
          <p className="text-gray-700 mb-4">
            Не вдалося знайти інформацію про вказане замовлення.
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Повернутися до замовлень
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return (
      new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH" })
        .format(amount)
        .replace("₴", "") + " грн"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Оформлення замовлення
            </h1>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Замовлення #{order.id}
                </h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.status}
                </span>
              </div>

              <div className="border rounded-md overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Товар
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Кількість
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ціна
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.order_items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.products.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {formatCurrency(item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Підсумок:</span>
                  <span className="text-gray-800">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between items-center font-semibold">
                    <span className="text-gray-800">До оплати:</span>
                    <span className="text-xl text-blue-600">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Адреса доставки
              </h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">
                  {order.shipping_address || "Адреса не вказана"}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Оплата
              </h3>
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                <p className="text-gray-700 mb-1">
                  Натисніть кнопку нижче, щоб продовжити оплату через безпечну
                  платіжну систему Stripe.
                </p>
                <p className="text-sm text-gray-500">
                  Після оплати ви отримаєте підтвердження на електронну пошту.
                  Всі платежі обробляються через захищену систему Stripe.
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <CheckoutButton
                  orderId={order.id}
                  userId={userId}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  onError={(error) => {
                    console.error("Помилка оплати:", error);
                    setError(
                      "Під час оплати сталася помилка. Спробуйте пізніше.",
                    );
                  }}
                />
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate(-1)}
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  Повернутися назад
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckoutPage;
