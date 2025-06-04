import { useCallback, useState } from "react";
export interface LocalCartItem {
  cartId: string;
  product_id: number;
  color_id?: number;
  size_id?: number;
  quantity: number;
  timestamp: number;
}

export const useLocalCart = () => {
  // const { refetch } = useCarts(true);
  const getLocalCart = useCallback((): LocalCartItem[] => {
    const cart = localStorage.getItem("localCart");
    return cart ? JSON.parse(cart) : [];
  }, []);

  // Додавання або збільшення кількості за product/color/size
  const addToLocalCart = (item: Omit<LocalCartItem, "timestamp">) => {
    const cart = getLocalCart();

    const existingIndex = cart.findIndex(
      (cartItem) =>
        cartItem.product_id === item.product_id &&
        cartItem.color_id === item.color_id &&
        cartItem.size_id === item.size_id,
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push({
        ...item,
        timestamp: Date.now(),
      });
    }

    localStorage.setItem("localCart", JSON.stringify(cart));
  };

  // Видалення товару по унікальному cartId
  interface RemoveCartParams {
    productId?: number;
    colorId?: number;
    sizeId?: number;
    cartId?: string | number;
  }

  const removeFromLocalCart = ({
    productId,
    colorId,
    sizeId,
    cartId,
  }: RemoveCartParams) => {
    const cart = getLocalCart();

    const updatedCart = cart.filter((item) => {
      if (cartId !== undefined && cartId !== null) {
        return item.cartId !== cartId;
      }

      return !(
        item.product_id === productId &&
        item.color_id === colorId &&
        item.size_id === sizeId
      );
    });

    localStorage.setItem("localCart", JSON.stringify(updatedCart));
  };

  // Оновлення кількості товару по унікальному cartId
  const updateQuantityInLocalCart = (
    id: string | number,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return; // можна додати видалення, якщо кількість стала 0

    const cart = getLocalCart();
    const index = cart.findIndex((item) => item.cartId === id);
    if (index !== -1) {
      cart[index].quantity = newQuantity;
      localStorage.setItem("localCart", JSON.stringify(cart));
    }
  };

  // Перевірка наявності товару по product/color/size
  const isInLocalCart = (
    productId: number,
    colorId?: number,
    sizeId?: number,
  ): boolean => {
    const cart = getLocalCart();
    return cart.some(
      (item) =>
        item.product_id === productId &&
        item.color_id === colorId &&
        item.size_id === sizeId,
    );
  };

  return {
    getLocalCart,
    addToLocalCart,
    removeFromLocalCart,
    updateQuantityInLocalCart,
    isInLocalCart,
  };
};
