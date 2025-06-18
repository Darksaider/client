// components/Cart.tsx
import { useState, useMemo, useCallback } from "react";
import { Modal } from "./WindowModal";
import Portal from "./Portal";
import { useCarts } from "../hooks/useCart";
import cartImg from "../assets/cart.svg";
import { Link } from "react-router";
import { CartItem } from "./CartItem";

export const Cart = () => {
  const {
    data: cartItems,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useCarts(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const cartSummary = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return { total: 0, savings: 0 };

    let totalWithoutDiscounts = 0;
    let actualTotal = 0;

    cartItems.forEach((item) => {
      const originalPrice = parseFloat(item.price) || 0;
      const discountedPrice = item.discounted_price
        ? parseFloat(item.discounted_price)
        : originalPrice;
      const quantity = item.quantity ?? 1;

      totalWithoutDiscounts += originalPrice * quantity;
      actualTotal += discountedPrice * quantity;
    });

    return {
      total: actualTotal,
      savings: totalWithoutDiscounts - actualTotal,
    };
  }, [cartItems]);

  // Мемоізований вміст модального вікна
  const modalContent = useMemo(() => {
    if (isCartLoading) {
      return (
        <p className="text-center text-gray-600 py-16">
          Завантаження кошика...
        </p>
      );
    }
    if (isCartLoading) {
      return (
        <p className="text-center text-red-600 py-16">
          Помилка завантаження кошика.
        </p>
      );
    }
    if (!cartItems || cartItems.length === 0) {
      return (
        <p className="text-center text-gray-600 py-16">Ваш кошик порожній.</p>
      );
    }

    return (
      <div className="rounded-lg border border-gray-200">
        {cartItems.map((cartItem, index) => (
          <CartItem
            key={cartItem.cartId}
            item={cartItem}
            // onRemove={handleRemoveItem}
            // onIncreaseQuantity={handleIncreaseQuantity}
            // onDecreaseQuantity={handleDecreaseQuantity}
            index={index}
          />
        ))}
      </div>
    );
  }, [
    cartItems,
    isCartLoading,
    isCartError,
    // handleRemoveItem,
    // handleIncreaseQuantity,
    // handleDecreaseQuantity,
  ]);

  return (
    <div className="relative">
      <button
        onClick={openModal}
        className="relative rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
        aria-label={`Відкрити кошик (${cartItems?.length ?? 0} товарів)`}
      >
        <img src={cartImg} alt="Кошик" className="h-6 w-6" />
        {!isCartLoading && cartItems && cartItems.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {cartItems.length}
          </span>
        )}
      </button>

      {isModalOpen && (
        <Portal targetId="modal-root">
          <Modal onClose={closeModal}>
            <div
              className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl md:h-[90vh] md:w-[80vw] md:max-w-5xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-heading"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-5">
                <h2
                  id="cart-heading"
                  className="text-2xl font-semibold text-gray-900"
                >
                  Ваш кошик
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  aria-label="Закрити кошик"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-grow overflow-y-auto bg-gray-50 p-5">
                {modalContent}
              </div>

              <div className="border-t border-gray-200 bg-white p-5">
                <div className="space-y-2 mb-5">
                  {cartSummary.savings > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-sm">Ваша економія:</span>
                      <span className="font-medium">
                        {cartSummary.savings.toFixed(2)} грн
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">
                      Загальна сума:
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {cartSummary.total.toFixed(2)} грн
                    </span>
                  </div>
                </div>

                <Link
                  onClick={closeModal}
                  className="w-full rounded-lg bg-green-600 py-3.5 px-5 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  to={"/checkout"}
                >
                  Оформити замовлення
                </Link>

                <div className="relative my-4">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">або</span>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={closeModal}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Продовжити покупки <span aria-hidden="true"> →</span>
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        </Portal>
      )}
    </div>
  );
};
