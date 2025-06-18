// ProductItem.tsx
import { NavLink } from "react-router";
import { Product } from "../types/product.type";
import React from "react";
import { StarRating } from "../UI/StarRating";

type ProductItemProps = {
  className?: string;
  product: Product;
};

export const ProductItem: React.FC<ProductItemProps> = ({
  className,
  product,
}) => {
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

  const hasDiscount = !!product?.product_discounts;

  // Розрахунок відсотка знижки з перевіркою на undefined
  const discountPercentage = hasDiscount
    ? Math.round(
        (1 - Number(product.discounted_price) / Number(product.price)) * 100,
      )
    : 0;

  return (
    <NavLink
      className={`group flex flex-col w-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 ${className || ""}`}
      to={`/products/${product.id}`}
    >
      <div className="relative w-full aspect-[3/4]">
        <img
          src={productImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover object-top bg-gray-100 "
          loading="lazy"
        />

        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}
        <div className="absolute top-1 left-1  text-white px-2 py-1 rounded text-xs sm:text-sm font-bold">
          <StarRating rating={product.rating} />
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-grow">
        <span className="text-xs sm:text-sm text-gray-600 font-medium line-clamp-1">
          {product.product_brands.name || "Без бренду"}
        </span>

        <h3 className="text-sm sm:text-base font-semibold line-clamp-2 flex-grow">
          {product.name}
        </h3>

        <div className="flex justify-between items-end mt-auto">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-base sm:text-lg font-bold text-red-600">
                  {formatPrice(product.discounted_price as string)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-base sm:text-lg font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {product.sales_count > 0 && (
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
              <span className="hidden sm:inline">Продано: </span>
              {product.sales_count}
            </span>
          )}
        </div>
      </div>
    </NavLink>
  );
};
