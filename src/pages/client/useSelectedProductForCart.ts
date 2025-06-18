import { useState, useEffect } from "react";
import { useProductItem } from "../../hooks/useProductItem";

export const useSelectedProductForCart = (productId: number) => {
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<number>(1);

  const {
    data: itemData,
    isLoading,
    isError,
    error,
  } = useProductItem(productId);

  useEffect(() => {
    if (itemData) {
      if (itemData.product_colors?.length > 0) {
        setSelectedColor(itemData.product_colors[0].color_id);
      }
      if (itemData.product_sizes?.length > 0) {
        setSelectedSize(itemData.product_sizes[0].size_id);
      }
    }
  }, [itemData]);

  return {
    itemData,
    isLoading,
    isError,
    error,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
  };
};
