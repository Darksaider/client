import { useState, useEffect } from "react";
import apiClient from "./apiClient";
import { useCarts } from "./useCart";
import { useLocalCart } from "./useLocalCart";
import toast from "react-hot-toast";

export const useProductCart = (
  productId: number,
  selectedColor: number,
  selectedSize: number,
  isLoggedIn: boolean,
) => {
  const [isInCart, setIsInCart] = useState(false);
  const { data: itemCarts, refetch: refetchCarts } = useCarts(isLoggedIn);
  const { addToLocalCart, removeFromLocalCart, isInLocalCart } = useLocalCart();

  // Перевірка наявності товару в кошику
  const checkCartStatus = () => {
    if (isLoggedIn) {
      const inDbCart =
        itemCarts?.some(
          (item) =>
            item.product_id === productId &&
            item.color.id === selectedColor &&
            item.size.id === selectedSize,
        ) ?? false;
      setIsInCart(inDbCart);
    } else {
      const inLocalCart = productId
        ? isInLocalCart(productId, selectedColor, selectedSize)
        : false;
      setIsInCart(inLocalCart);
    }
  };

  useEffect(() => {
    checkCartStatus();
  }, [selectedColor, selectedSize, itemCarts, isLoggedIn, productId]);

  const toggleCartItem = async () => {
    if (!productId) return;

    try {
      if (isLoggedIn) {
        // Для авторизованого користувача
        if (isInCart) {
          const cartItemToDelete = itemCarts?.find(
            (item) =>
              item.product_id === productId &&
              item.color.id === selectedColor &&
              item.size.id === selectedSize,
          );

          if (cartItemToDelete) {
            await apiClient.delete(`/cart/${cartItemToDelete.cartId}`);
            toast.success("Товар видалено з кошика");
          }
        } else {
          await apiClient.post("/cart", {
            product_id: productId,
            color_id: selectedColor,
            size_id: selectedSize,
          });
          toast.success("Товар додано до кошика");
        }
        refetchCarts();
      } else {
        if (isInCart) {
          const dataToRemove = {
            productId: productId,
            colorId: selectedColor,
            sizeId: selectedSize,
          };
          removeFromLocalCart(dataToRemove);
          // ПОТІМ оновлюємо стан (це важливо!)
          toast.success("Товар видалено з кошика");
          setIsInCart(false);
        } else {
          // СПОЧАТКУ додаємо в localStorage
          addToLocalCart({
            cartId: `${productId}${selectedColor}${selectedSize}`,
            product_id: productId,
            color_id: selectedColor,
            size_id: selectedSize,
            quantity: 1,
          });
          setIsInCart(true);
          toast.success("Товар додано до кошика");
        }

        refetchCarts();
      }
    } catch (error) {
      console.error("Error managing cart", error);
      toast.success("Помилка при додаванні/видаленні з кошика");
    }
  };
  const removeCart = async (cartId: number | string) => {
    if (!cartId) return;

    try {
      if (isLoggedIn) {
        await apiClient.delete(`/cart/${cartId}`);
      } else {
        removeFromLocalCart({ cartId: cartId });
      }
      toast.success("Товар успішно видалено з кошика");
      refetchCarts();
    } catch (error) {
      console.error("Error removing cart item", error);
      toast.error("Помилка при видаленні з кошика");
    }
  };
  // const updateQuantityInlCart = async (cartId: number | string) => {
  //   if (!cartId) return;

  //   try {
  //     if (isLoggedIn) {
  //       await apiClient.delete(`/cart/${cartId}`);
  //     } else {
  //       removeFromLocalCart({ cartId: cartId });
  //     }
  //     toast.success("Операція успішна");
  //     refetchCarts();
  //   } catch (error) {
  //     console.error("Error removing cart item", error);
  //     toast.error("Помилка при видаленні з кошика");
  //   }
  // };
  return {
    isInCart,
    removeCart,
    toggleCartItem,
    checkCartStatus,
  };
};
