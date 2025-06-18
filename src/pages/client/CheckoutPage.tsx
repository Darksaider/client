import React, { useMemo, useCallback } from "react";
import { Link } from "react-router";
import { useCarts } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useLogin";
import CheckoutForm from "../../components/paytment/CheckoutForm";

// Типи для компонента
interface CartItem {
  id: number;
  name: string;
  price: number;
  discounted_price?: number;
  discount_percentage?: number;
  quantity: number;
  photo_url?: string;
}

interface CheckoutPageProps {
  className?: string;
}

// Константи
const DELIVERY_TEXT = "За тарифами перевізника";
const PRODUCTS_ROUTE = "/products";
const CART_ROUTE = "/cart";

// Утилітарні функції
const formatPrice = (price: number): string => price.toFixed(2);

const getItemCountText = (count: number): string => {
  if (count === 1) return " товар";
  if (count < 5) return " товари";
  return " товарів";
};

// Компонент іконки порожнього кошика
const EmptyCartIcon: React.FC<{ className?: string }> = ({
  className = "w-16 h-16 text-gray-400",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Порожній кошик"
  >
    <path
      d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 6H21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Компонент іконки стрілки назад
const BackArrowIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 mr-2",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M19 12H5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 19L5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Компонент іконки безпеки
const SecurityIcon: React.FC<{ className?: string }> = ({
  className = "w-4 h-4 text-green-600 mr-2",
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 12L11 14L15 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Компонент завантаження
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Компонент порожнього стану
const EmptyCartState: React.FC = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="text-center max-w-md p-8">
      <div className="flex justify-center mb-6">
        <EmptyCartIcon />
      </div>
      <h1 className="text-2xl font-semibold mb-3 text-gray-800">
        Ваш кошик порожній
      </h1>
      <p className="text-gray-500 mb-6">
        Додайте товари в кошик, щоб продовжити оформлення замовлення.
      </p>
      <Link
        to={PRODUCTS_ROUTE}
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Перейти до каталогу
      </Link>
    </div>
  </div>
);

// Компонент елемента замовлення
const OrderItem: React.FC<{ item: CartItem }> = React.memo(({ item }) => {
  const itemPrice = item.discounted_price || item.price;
  const originalPrice = item.price;
  const hasDiscount =
    item.discounted_price && item.discounted_price < item.price;
  const totalItemPrice = itemPrice * item.quantity;
  const originalTotalPrice = originalPrice * item.quantity;

  return (
    <div className="flex items-start border-b border-gray-200 pb-4 last:border-b-0">
      <div className="relative flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
        {item.photo_url ? (
          <img
            src={item.photo_url}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">Фото</span>
          </div>
        )}
        <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-indigo-600 text-white text-xs font-semibold rounded-full">
          {item.quantity}
        </div>
      </div>
      <div className="ml-4 flex-1 flex flex-col">
        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
          {item.name}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatPrice(totalItemPrice)} грн
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(originalTotalPrice)} грн
              </span>
              {item.discount_percentage && (
                <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded">
                  -{item.discount_percentage}%
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

OrderItem.displayName = "OrderItem";

// Головний компонент
const CheckoutPage: React.FC<CheckoutPageProps> = ({ className }) => {
  const { data: cartItems, isLoading, error } = useCarts(true);
  const { id: userId } = useAuth();

  // Мемоізований розрахунок загальної суми
  const subtotal = useMemo(() => {
    if (!cartItems) return 0;
    return cartItems.reduce((sum, item) => {
      const itemPrice = item.discounted_price || item.price;
      return sum + itemPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  // Мемоізований текст кількості товарів
  const itemCountText = useMemo(() => {
    if (!cartItems) return "";
    return cartItems.length + getItemCountText(cartItems.length);
  }, [cartItems]);

  // Обробник успішного створення замовлення
  const handleOrderCreated = useCallback((orderId: number) => {
    console.log(`Замовлення #${orderId} успішно створено`);
    // - очистити кошик
  }, []);

  // Стани завантаження та помилок
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center max-w-md p-8">
          <p className="text-red-600 mb-4">Помилка завантаження кошика</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div
      className={`max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 ${className || ""}`}
    >
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Заголовок */}
        <header className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Оформлення замовлення
            </h1>
            <Link
              to={CART_ROUTE}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-2 py-1"
            >
              <BackArrowIcon />
              Повернутися до кошика
            </Link>
          </div>
        </header>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <section
            className="lg:col-span-7"
            aria-label="Форма оформлення замовлення"
          >
            <CheckoutForm
              cartItems={cartItems}
              userId={userId}
              onOrderCreated={handleOrderCreated}
            />
          </section>

          {/* Підсумок замовлення */}
          <aside
            className="lg:col-span-5 bg-gray-50 p-6"
            aria-label="Підсумок замовлення"
          >
            <div className="sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ваше замовлення
              </h2>

              <p className="text-sm text-gray-500 mb-4">{itemCountText}</p>

              {/* Список товарів */}
              <div className="space-y-4 mb-6" role="list">
                {cartItems.map((item) => (
                  <div key={item.id} role="listitem">
                    <OrderItem item={item} />
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Сума товарів</span>
                  <span>{formatPrice(subtotal)} грн</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Доставка</span>
                  <span>{DELIVERY_TEXT}</span>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">
                      До сплати
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {formatPrice(subtotal)} грн
                    </span>
                  </div>
                </div>
              </div>

              {/* Повідомлення про безпеку */}
              <div className="mt-6 bg-green-50 rounded-lg p-3 flex items-center">
                <SecurityIcon />
                <span className="text-xs text-green-800">
                  Безпечна оплата гарантована
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
