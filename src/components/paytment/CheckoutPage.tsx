import React from "react";
import { Link } from "react-router"; // виправлено імпорт
import CheckoutForm from "./CheckoutForm";
import { useCarts } from "../../hooks/useCart"; // виправлено назву хука

const CheckoutPage: React.FC = () => {
  // Стан для зберігання товарів кошика
  const { data: cartItems = [] } = useCarts(true);

  const userId = 2; // Приклад: Отримайте з контексту авторизації

  // Обробка успішного створення замовлення
  const handleOrderCreated = (orderId: number) => {
    console.log(`Замовлення #${orderId} успішно створено`);
  };

  // Відображення порожнього кошика
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center max-w-md p-8">
          <div className="flex justify-center mb-6">
            <svg
              className="w-16 h-16 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
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
          </div>
          <h1 className="text-2xl font-semibold mb-3 text-gray-800">
            Ваш кошик порожній
          </h1>
          <p className="text-gray-500 mb-6">
            Додайте товари в кошик, щоб продовжити оформлення замовлення.
          </p>
          <Link
            to="/products"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
          >
            Перейти до каталогу
          </Link>
        </div>
      </div>
    );
  }

  // Розрахунок загальної вартості
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.products.discoundet_price * item.quantity,
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Оформлення замовлення
            </h1>
            <Link
              to="/cart"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition duration-150"
            >
              <svg
                className="w-4 h-4 mr-2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
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
              Повернутися до кошика
            </Link>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7 ">
            <CheckoutForm
              cartItems={cartItems}
              userId={userId}
              onOrderCreated={handleOrderCreated}
            />
          </div>

          <div className="lg:col-span-5 bg-gray-50 p-6">
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ваше замовлення
              </h3>

              <div className="text-sm text-gray-500 mb-4">
                {cartItems.length}
                {cartItems.length === 1
                  ? "товар"
                  : cartItems.length < 5
                    ? "товари"
                    : "товарів"}
              </div>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="relative flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      {item.products.product_photos ? (
                        <img
                          src={item.products.product_photos[0].photo_url}
                          alt={item.products.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200"></div>
                      )}
                      <div className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="ml-4 flex-1 flex flex-col">
                      <div className="font-medium text-sm text-gray-900 line-clamp-2">
                        {item.products.name}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-gray-900">
                        {item.discounted_price
                          ? item.discounted_price
                          : Number(item.products.price) * (item.quantity ?? 0)}
                        грн
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Сума товарів</span>
                  <span>{subtotal.toFixed(2)} грн</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Доставка</span>
                  <span>За тарифами перевізника</span>
                </div>

                {subtotal > 1000 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Знижка</span>
                    <span>-{(subtotal * 0.05).toFixed(2)} грн</span>
                  </div>
                )}

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">
                      До сплати
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      {(subtotal > 1000 ? subtotal * 0.95 : subtotal).toFixed(
                        2,
                      )}{" "}
                      грн
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-green-50 rounded-lg p-3 flex items-center">
                <svg
                  className="w-4 h-4 text-green-600 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
                <span className="text-xs text-green-800">
                  Безпечна оплата гарантована
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
