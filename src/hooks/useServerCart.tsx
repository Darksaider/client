import { useState } from "react";

export const useServerCart = () => {
  const [selectedColor, setSelectedColor] = useState<number | undefined>(
    undefined,
  );
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    undefined,
  );

  return { selectedColor, selectedSize };
};
