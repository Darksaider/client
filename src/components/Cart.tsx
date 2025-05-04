// components/Cart.tsx
import { useState, useMemo } from "react";
import { Modal } from "./Modal";
import Portal from "./Portal";
import { useCarts } from "../hooks/useCart";
import { ClientCartItem } from "../types/types";
import cartImg from "../assets/cart.svg";
import { Link, NavLink } from "react-router";

// components/CartItem.tsx
import React from "react";

interface CartItemProps {
  item: ClientCartItem;
  onRemove?: (cartItemId: number) => void;
  onIncreaseQuantity?: (cartItemId: number) => void;
  onDecreaseQuantity?: (cartItemId: number) => void;
  index: number;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onIncreaseQuantity,
  onDecreaseQuantity,
  index,
}) => {
  const product = item.products;
  const imageUrl =
    product.product_photos?.length > 0
      ? product.product_photos[0].photo_url
      : "/placeholder.jpg";

  // Use discounted price if available
  const hasDiscount = item.discount_percentage > 0;
  const price = hasDiscount ? item.discounted_price : product.price;

  const handleRemove = () => onRemove?.(item.id);
  const handleIncrease = () => onIncreaseQuantity?.(item.id);
  const handleDecrease = () => onDecreaseQuantity?.(item.id);

  const bgColor = index % 2 === 0 ? "bg-white" : "bg-gray-200";

  return (
    <div
      className={`flex items-start space-x-4 p-4 ${bgColor} first:rounded-t-lg last:rounded-b-lg relative mb-1.5`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-24 w-24 rounded-md object-cover"
        />
      </div>
      <div className="flex flex-grow flex-col justify-between h-24">
        <div>
          <NavLink
            to={`/products/${product.id}`}
            className="mb-1 block font-medium text-gray-900 hover:text-blue-600 text-base"
          >
            {product.name}
          </NavLink>

          {hasDiscount ? (
            <div className="flex items-baseline space-x-2">
              <p className="text-sm text-red-600 font-medium">
                {item.discounted_price} грн
              </p>
              <p className="text-xs text-gray-500 line-through">
                {product.price} грн
              </p>
              <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                -{item.discount_percentage}%
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-700">Ціна: {product.price} грн</p>
          )}
        </div>

        {/* Quantity controls */}
        <div className="flex items-center justify-start mt-2">
          <div className="flex items-center space-x-2 rounded border border-gray-300">
            <button
              onClick={handleDecrease}
              disabled={item.quantity === 1}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l"
              aria-label="Зменшити кількість"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </button>
            <span className="px-3 text-sm font-medium text-gray-800">
              {item.quantity ?? 1}
            </span>
            <button
              onClick={handleIncrease}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r"
              aria-label="Збільшити кількість"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          aria-label={`Видалити ${product.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export const Cart = () => {
  const { data, isLoading, isError } = useCarts(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveItem = (cartItemId: number) => {
    console.log("Видалення елемента:", cartItemId);
    alert(`Логіка видалення товару ID: ${cartItemId}`);
  };

  const handleIncreaseQuantity = (cartItemId: number) => {
    console.log("Збільшити кількість:", cartItemId);
    alert(`Логіка збільшення кількості ID: ${cartItemId}`);
  };

  const handleDecreaseQuantity = (cartItemId: number) => {
    console.log("Зменшити кількість:", cartItemId);
    alert(`Логіка зменшення кількості ID: ${cartItemId}`);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Updated to calculate using discounted prices if available
  const cartSummary = useMemo(() => {
    if (!data) return { total: 0, savings: 0 };

    let totalWithoutDiscounts = 0;
    let actualTotal = 0;

    data.forEach((item) => {
      const originalPrice = parseFloat(item.products.price) || 0;
      const discountedPrice = item.discounted_price
        ? item.discounted_price
        : originalPrice;
      const quantity = item.quantity ?? 1;

      totalWithoutDiscounts += originalPrice * quantity;
      actualTotal += discountedPrice * quantity;
    });

    return {
      total: actualTotal,
      savings: totalWithoutDiscounts - actualTotal,
    };
  }, [data]);

  const renderModalContent = () => {
    if (isLoading) {
      return (
        <p className="text-center text-gray-600 py-16">
          Завантаження кошика...
        </p>
      );
    }
    if (isError) {
      return (
        <p className="text-center text-red-600 py-16">
          Помилка завантаження кошика.
        </p>
      );
    }
    if (!data || data.length === 0) {
      return (
        <p className="text-center text-gray-600 py-16">Ваш кошик порожній.</p>
      );
    }

    return (
      <div className="rounded-lg border border-gray-200">
        {data.map((cartItem, index) => (
          <CartItem
            key={cartItem.id}
            item={cartItem}
            onRemove={handleRemoveItem}
            onIncreaseQuantity={handleIncreaseQuantity}
            onDecreaseQuantity={handleDecreaseQuantity}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={openModal}
        className="relative rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 cursor-pointer"
        aria-label={`Відкрити кошик (${data?.length ?? 0} товарів)`}
      >
        <img src={cartImg} alt="Кошик" className="h-6 w-6" />
        {!isLoading && data && data.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {data.length}
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
                {renderModalContent()}
              </div>

              <div className="border-t border-gray-200 bg-white p-5">
                <div className="space-y-2 mb-5">
                  {/* Display savings if any */}
                  {cartSummary.savings > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-sm">Ваша економія:</span>
                      <span className="font-medium">
                        {cartSummary.savings.toFixed(2)} грн
                      </span>
                    </div>
                  )}

                  {/* Total sum */}
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
                  onClick={() => setIsModalOpen(false)}
                  // disabled={!data || data.length === 0 || isLoading}
                  className="w-full rounded-lg bg-green-600 py-3.5 px-5 text-center text-base font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  to={"/checkout"}
                >
                  Оформити замовлення
                </Link>

                {/* Separator Text */}
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
