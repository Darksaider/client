import React, { useState } from "react";
import { useOrders } from "../hooks/useOrder";

// Типи для TypeScript
interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  color_id: number;
  size_id: number;
  products: {
    id: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    sales_count: number;
    created_at: string;
    updated_at: string;
  };
  colors: {
    id: number;
    name: string;
    hex_code: string;
  };
  sizes: {
    id: number;
    size: string;
  };
}

export interface Order {
  id: number;
  user_id: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: string;
  shipping_address: string;
  payment_method: "card" | "cash" | "bank_transfer";
  stripe_session_id: string;
  payment_status: "awaiting" | "paid" | "failed" | "refunded";
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
}

// Утилітарні функції
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return numPrice.toLocaleString("uk-UA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusConfig = (status: Order["status"]) => {
  const configs = {
    pending: {
      label: "Очікує обробки",
      bgColor: "bg-gradient-to-r from-amber-50 to-yellow-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      icon: "⏳",
      iconBg: "bg-amber-100",
    },
    processing: {
      label: "Обробляється",
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      icon: "⚙️",
      iconBg: "bg-blue-100",
    },
    shipped: {
      label: "Відправлено",
      bgColor: "bg-gradient-to-r from-purple-50 to-indigo-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      icon: "🚚",
      iconBg: "bg-purple-100",
    },
    delivered: {
      label: "Доставлено",
      bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      icon: "✅",
      iconBg: "bg-emerald-100",
    },
    cancelled: {
      label: "Скасовано",
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      icon: "❌",
      iconBg: "bg-red-100",
    },
  };
  return configs[status] || configs.pending;
};

const getPaymentStatusConfig = (status: Order["payment_status"]) => {
  const configs = {
    awaiting: {
      label: "Очікує оплати",
      bgColor: "bg-gradient-to-r from-orange-50 to-amber-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
      icon: "⏰",
    },
    paid: {
      label: "Оплачено",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      icon: "💳",
    },
    failed: {
      label: "Помилка оплати",
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      icon: "⚠️",
    },
    refunded: {
      label: "Повернено",
      bgColor: "bg-gradient-to-r from-gray-50 to-slate-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      icon: "↩️",
    },
  };
  return configs[status] || configs.awaiting;
};

// Компонент загрузки з покращеною анімацією
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center py-16">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent absolute top-0 left-0"></div>
    </div>
    <div className="ml-4 text-gray-600 font-medium">
      Завантаження замовлень...
    </div>
  </div>
);

// Компонент порожнього стану з покращеним дизайном
const EmptyState: React.FC = () => (
  <div className="text-center py-20">
    <div className="relative inline-block mb-6">
      <div className="text-8xl mb-2 filter drop-shadow-lg">📦</div>
      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">
      У вас поки немає замовлень
    </h3>
    <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
      Коли ви зробите перше замовлення, воно з'явиться тут. Час почати покупки!
    </p>
    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
      Почати покупки 🛍️
    </button>
  </div>
);

// Компонент товару в замовленні з покращеним дизайном
const OrderItemComponent: React.FC<{ item: OrderItem }> = ({ item }) => {
  const { products, colors, sizes, quantity, price } = item;
  const itemTotal = parseFloat(price) * quantity;

  return (
    <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <span className="text-3xl filter drop-shadow-sm">👕</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 truncate mb-1">
          {products.name}
        </h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {products.description}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-xs font-medium text-gray-500">Колір:</span>
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: colors.hex_code }}
              title={colors.name}
            />
            <span className="text-xs font-medium text-gray-700">
              {colors.name}
            </span>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-xs font-medium text-gray-500">Розмір: </span>
            <span className="text-xs font-bold text-gray-700">
              {sizes.size}
            </span>
          </div>

          <div className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-xs font-medium text-gray-500">
              Кількість:{" "}
            </span>
            <span className="text-xs font-bold text-gray-700">{quantity}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-bold text-gray-900 mb-1">
          {formatPrice(itemTotal)} ₴
        </div>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
          {formatPrice(price)} ₴ × {quantity}
        </div>
      </div>
    </div>
  );
};

// Компонент одного замовлення з покращеним дизайном
const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div
        className="p-6 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Замовлення #{order.id}
              </h3>

              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} shadow-sm`}
              >
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${statusConfig.iconBg} mr-2`}
                >
                  <span className="text-xs">{statusConfig.icon}</span>
                </span>
                {statusConfig.label}
              </div>

              <div
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${paymentConfig.bgColor} ${paymentConfig.textColor} border ${paymentConfig.borderColor} shadow-sm`}
              >
                <span className="mr-2">{paymentConfig.icon}</span>
                {paymentConfig.label}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span>📅</span>
                <span className="font-medium">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span>📍</span>
                <span className="font-medium">
                  {order.shipping_address.split(",")[0]}...
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span>{order.payment_method === "card" ? "💳" : "💵"}</span>
                <span className="font-medium">
                  {order.payment_method === "card" ? "Картка" : "Готівка"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(order.total_amount)} ₴
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {order.order_items.length}{" "}
                {order.order_items.length === 1 ? "товар" : "товарів"}
              </div>
            </div>

            <div
              className={`transform transition-all duration-200 p-2 rounded-full hover:bg-gray-100 ${isExpanded ? "rotate-180 bg-indigo-100" : ""}`}
            >
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Розгорнутий контент з покращеною анімацією */}
      {isExpanded && (
        <div className="border-t border-gray-100 animate-in slide-in-from-top duration-300">
          {/* Товари */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50">
            <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-indigo-100 p-2 rounded-lg mr-3">🛍️</span>
              Товари в замовленні
            </h4>
            <div className="space-y-2 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              {order.order_items.map((item, index) => (
                <div key={item.id}>
                  <OrderItemComponent item={item} />
                  {index < order.order_items.length - 1 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Додаткова інформація */}
          <div className="bg-gradient-to-br from-slate-50 to-gray-100 px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-lg mr-3 text-lg">
                    🏠
                  </span>
                  Адреса доставки
                </h5>
                <p className="text-gray-700 leading-relaxed">
                  {order.shipping_address}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3 text-lg">
                    💳
                  </span>
                  Деталі оплати
                </h5>
                <p className="text-gray-700 mb-2">
                  <span className="font-medium">Метод:</span>{" "}
                  {order.payment_method === "card"
                    ? "Банківська картка"
                    : "Готівка"}
                </p>
                {order.stripe_session_id && (
                  <p className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded font-mono">
                    ID: ...{order.stripe_session_id.slice(-12)}
                  </p>
                )}
              </div>
            </div>

            {order.notes && (
              <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h5 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="bg-yellow-100 p-2 rounded-lg mr-3 text-lg">
                    📝
                  </span>
                  Примітки
                </h5>
                <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg italic">
                  "{order.notes}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Головний компонент з покращеним дизайном
export const OrdersPage: React.FC = () => {
  const { data: orders, isLoading, isError, refetch } = useOrders(true);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Мої замовлення
          </h1>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Мої замовлення
          </h1>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😞</div>
              <div className="text-red-600 mb-6 text-lg font-semibold">
                Помилка завантаження замовлень
              </div>
              <button
                onClick={() => refetch()}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🔄 Спробувати знову
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
            Мої замовлення
          </h1>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <EmptyState />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Мої замовлення
          </h1>
          <button
            onClick={() => refetch()}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold bg-white hover:bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-200 hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>🔄</span>
            <span>Оновити</span>
          </button>
        </div>

        <div className="space-y-0">
          {orders.map((order: Order, index: number) => (
            <div
              key={order.id}
              className="animate-in slide-in-from-bottom duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <OrderCard order={order} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
