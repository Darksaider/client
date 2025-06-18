import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router";
import { ClientCartItem } from "../types/types";
import { useProductCart } from "../hooks/useProductCart";
import { useUpdateCartItemQuantity } from "../hooks/useCart";
import { useAuthContext } from "../hooks/useLoginContext";

interface CartItemProps {
  item: ClientCartItem;
  index: number;
}

export const CartItem: React.FC<CartItemProps> = ({ item, index }) => {
  const product = item;
  const imageUrl =
    product.photo_url?.length > 0 ? product.photo_url : "/placeholder.jpg";

  const hasDiscount = item.discount_percentage ?? 0;
  const { isLoggedIn } = useAuthContext();
  const price = hasDiscount ? item.discounted_price : product.price;

  const { removeCart } = useProductCart(
    item.product_id,
    item.color.id,
    item.size.id,
    isLoggedIn,
  );

  // Локальний стан для кількості
  const [localQuantity, setLocalQuantity] = useState<number>(
    item.quantity ?? 1,
  );

  // Ref для відстеження чи є активна мутація
  const isMutatingRef = useRef(false);

  const updateQuantityMutation = useUpdateCartItemQuantity();

  // Оновлюємо локальний стан тільки якщо немає активної мутації
  useEffect(() => {
    if (!isMutatingRef.current) {
      setLocalQuantity(item.quantity ?? 1);
    }
  }, [item.quantity]);

  // Відстежуємо стан мутації
  useEffect(() => {
    if (updateQuantityMutation.isPending) {
      isMutatingRef.current = true;
    } else {
      isMutatingRef.current = false;
    }
  }, [updateQuantityMutation.isPending]);

  const handleUpdateQuantity = (newQuantity: number) => {
    setLocalQuantity(newQuantity);
    console.log(newQuantity);

    updateQuantityMutation.mutate({
      cartId: +item.cartId,
      quantity: newQuantity,
    });
  };

  const handleIncrease = () => {
    handleUpdateQuantity(localQuantity + 1);
  };

  const handleDecrease = () => {
    if (localQuantity > 1) {
      handleUpdateQuantity(localQuantity - 1);
    }
  };

  const handleRemove = async () => {
    await removeCart(item.cartId);
  };

  // Розрахунок загальної вартості на основі локальної кількості
  const totalPrice =
    (hasDiscount ? Number(item.discounted_price) : Number(product.price)) *
    localQuantity;
  const originalTotalPrice = Number(product.price) * localQuantity;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6 mb-4 relative group">
      {/* Кнопка видалення */}
      <button
        onClick={handleRemove}
        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center z-10"
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

      {/* Знижка badge */}
      {hasDiscount > 0 && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg z-10">
          -{item.discount_percentage}%
        </div>
      )}

      <div className="flex gap-6">
        {/* Зображення товару */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
            <img
              src={imageUrl}
              alt={item.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Інформація про товар */}
        <div className="flex-grow space-y-3">
          {/* Назва товару */}
          <div>
            <NavLink
              to={`/products/${product.product_id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2"
            >
              {item.name}
            </NavLink>
          </div>

          {/* Характеристики */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Колір:</span>
              <div className="flex items-center gap-1">
                <div
                  className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: item.color.hex_code }}
                ></div>
                <span className="font-medium">{item.color.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Розмір:</span>
              <span className="font-medium bg-gray-100 px-2 py-1 rounded-md">
                {item.size.size}
              </span>
            </div>
          </div>

          {/* Опис товару */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Ціна та кількість */}
          <div className="flex items-center justify-between pt-2">
            {/* Ціна */}
            <div className="space-y-1">
              {hasDiscount ? (
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-red-600">
                      {item.discounted_price} грн
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {product.price} грн
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Загалом:{" "}
                    <span className="font-semibold text-red-600">
                      {totalPrice} грн
                    </span>
                    {hasDiscount && (
                      <span className="text-gray-500 line-through ml-2">
                        {originalTotalPrice} грн
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-xl font-bold text-gray-900">
                    {product.price} грн
                  </div>
                  <div className="text-sm text-gray-600">
                    Загалом:{" "}
                    <span className="font-semibold">{totalPrice} грн</span>
                  </div>
                </div>
              )}
            </div>

            {/* Контроль кількості */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Кількість:</span>
              <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <button
                  onClick={handleDecrease}
                  disabled={localQuantity === 1}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-xl transition-colors"
                  aria-label="Зменшити кількість"
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
                      d="M19.5 12h-15"
                    />
                  </svg>
                </button>

                <div className="relative px-4 py-2 min-w-[3rem] text-center">
                  <span className="font-semibold text-gray-900">
                    {localQuantity}
                  </span>
                  {updateQuantityMutation.isPending && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>

                <button
                  onClick={handleIncrease}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-xl transition-colors"
                  aria-label="Збільшити кількість"
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
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
