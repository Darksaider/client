import React, { useState } from "react";
import { useOrders } from "../hooks/useOrder";
import { NavLink } from "react-router";
import { OrdersSkeleton } from "./skeleton/PrdersLoadingSkeleton";
import { getPaymentStatusConfig, getStatusConfig } from "../store/DefaultData";

// Типи для TypeScript
export interface OrderItem {
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
  status: "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: string;
  shipping_address: string;
  payment_method: "card" | "cash" | "bank_transfer";
  payment_status: "awaiting" | "completed" | "refunded" | "failed" | "expired";
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

// Компонент загрузки
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
    <NavLink
      to={"/products"}
      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      Почати покупки 🛍️
    </NavLink>
  </div>
);

const OrderItemComponent: React.FC<{ item: OrderItem }> = ({ item }) => {
  const { products, colors, sizes, quantity, price } = item;
  const itemTotal = parseFloat(price) * quantity;

  return (
    <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200">
      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
        <span className="text-2xl filter drop-shadow-sm">👕</span>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900 truncate mb-1">
          {products.name}
        </h4>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {products.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-white px-2 py-1 rounded-lg border border-gray-200">
            <div
              className="w-3 h-3 rounded-full border border-gray-300"
              style={{ backgroundColor: colors.hex_code }}
              title={colors.name}
            />
            <span className="text-xs text-gray-700">{colors.name}</span>
          </div>

          <div className="bg-white px-2 py-1 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-700">{sizes.size}</span>
          </div>

          <div className="bg-white px-2 py-1 rounded-lg border border-gray-200">
            <span className="text-xs text-gray-700">×{quantity}</span>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-bold text-gray-900">
          {formatPrice(itemTotal)} ₴
        </div>
        <div className="text-xs text-gray-500">
          {formatPrice(price)} ₴ за шт.
        </div>
      </div>
    </div>
  );
};

// Компонент одного замовлення
const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = getStatusConfig(order.status);
  const paymentConfig = getPaymentStatusConfig(order.payment_status);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-all duration-200"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Замовлення #{order.id}
              </h3>

              <div
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}
              >
                <span className="mr-2">{statusConfig.icon}</span>
                {statusConfig.label}
              </div>

              <div
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${paymentConfig.bgColor} ${paymentConfig.textColor} border ${paymentConfig.borderColor}`}
              >
                <span className="mr-2">{paymentConfig.icon}</span>
                {paymentConfig.label}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>{order.shipping_address.split(",")[0]}...</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {formatPrice(order.total_amount)} ₴
              </div>
              <div className="text-sm text-gray-500">
                {order.order_items.length} товар
                {order.order_items.length !== 1 ? "ів" : ""}
              </div>
            </div>

            <div
              className={`transform transition-all duration-200 p-2 rounded-full hover:bg-gray-100 ${isExpanded ? "rotate-180 bg-indigo-100" : ""}`}
            >
              <svg
                className="w-5 h-5 text-gray-500"
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

      {/* Розгорнутий контент */}
      {isExpanded && (
        <div className="border-t border-gray-100 animate-in slide-in-from-top duration-300">
          {/* Товари */}
          <div className="p-6 bg-gray-50">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🛍️</span>
              Товари в замовленні
            </h4>
            <div className="space-y-2 bg-white rounded-xl p-4">
              {order.order_items.map((item, index) => (
                <div key={item.id}>
                  <OrderItemComponent item={item} />
                  {index < order.order_items.length - 1 && (
                    <div className="h-px bg-gray-200 my-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Адреса доставки */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <h5 className="font-bold text-gray-900 mb-2 flex items-center">
                <span className="mr-2">🏠</span>
                Адреса доставки
              </h5>
              <p className="text-gray-700">{order.shipping_address}</p>
            </div>

            {order.notes && (
              <div className="mt-4 bg-white rounded-xl p-4 border border-gray-100">
                <h5 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="mr-2">📝</span>
                  Примітки
                </h5>
                <p className="text-gray-700 italic">"{order.notes}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const OrdersPage: React.FC = () => {
  const { data: orders, isLoading, isError, refetch } = useOrders(true);

  if (isLoading) {
    return <OrdersSkeleton />;
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
