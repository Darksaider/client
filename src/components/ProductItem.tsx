import { NavLink } from "react-router";
import { Product } from "../types/product.type";
import React, { useState } from "react";

// Імпорти Swiper стилів (ВОНИ ВСЕ ЩЕ ПОТРІБНІ для базової структури та функціоналу Swiper!)

type ProductItemProps = {
  className: string;
  product: Product;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  className,
  product,
}) => {
  return (
    <NavLink className={className} to={`${product.id}`}>
      <div>
        {/* <img src={product.product_photos[0].photo_url} alt="img" /> */}
      </div>
      <div>
        <div>
          <span>{product.name}</span>
          <span> Ціна {product.price}</span>
        </div>
        <span>{product.description}</span>
      </div>
    </NavLink>
  );
};
