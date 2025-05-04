import { NavLink } from "react-router";
import { Product } from "../types/product.type";
import React from "react";

type ProductItemProps = {
  className?: string;
  product: Product;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  className,
  product,
}) => {
  // Форматування ціни
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "UAH",
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  // Знаходження першого доступного фото або використання заглушки
  const productImage =
    product.product_photos && product.product_photos.length > 0
      ? product.product_photos[0].photo_url
      : "https://via.placeholder.com/300x300?text=Фото+відсутнє";

  const hasDiscount = product.discounted_price !== undefined;

  // Розрахунок відсотка знижки з перевіркою на undefined
  const discountPercentage = hasDiscount
    ? Math.round(
        (1 - Number(product.discounted_price) / Number(product.price)) * 100,
      )
    : 0;

  return (
    <NavLink
      className={`group flex flex-col w-full max-w-xs bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 ${className || ""}`}
      to={`/products/${product.id}`}
    >
      <div className="relative w-full" style={{ paddingTop: "100%" }}>
        <img
          src={productImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover bg-gray-100"
        />

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
            {discountPercentage}%
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <span className="text-sm text-gray-600 font-medium">
          {/* {product.brands[0].name} */}
        </span>

        <h3 className="text-base font-semibold overflow-hidden line-clamp-2 h-12 m-0">
          {product.name}
        </h3>

        <div className="flex justify-between items-center mt-2">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-red-600">
                  {formatPrice(product.discounted_price as string)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Показник популярності */}
          {product.sales_count > 0 && (
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Продано: {product.sales_count}
            </span>
          )}
        </div>
      </div>
    </NavLink>
  );
};
