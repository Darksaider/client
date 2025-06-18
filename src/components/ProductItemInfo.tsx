import { BadgeCheck, Truck, Heart } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";
import { Product } from "../types/product.type";

interface ProductItemInfoProps {
  itemData: Product;
}

export const ProductItemInfo = ({ itemData }: ProductItemInfoProps) => {
  const hasDiscount =
    itemData?.product_discounts && itemData.product_discounts.length > 0;
  const discountEndDate = hasDiscount
    ? (itemData.product_discounts?.[0]?.discounts?.end_date ?? null)
    : null;

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{itemData.name}</h1>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          {itemData.product_brands && itemData.product_brands.length > 0 && (
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
              Бренд: {itemData.product_brands[0].brands.name}
            </span>
          )}

          {itemData.product_categories &&
            itemData.product_categories.length > 0 && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                Категорія:{" "}
                {itemData.product_categories
                  .map((cat) => cat.categories.name)
                  .join(", ")}
              </span>
            )}
        </div>

        <p className="text-gray-700">{itemData.description}</p>
      </div>

      <div className="space-y-3 border-b pb-4">
        {hasDiscount ? (
          <>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-red-600 mr-3">
                {itemData.discounted_price} грн
              </p>
              <p className="text-lg line-through text-gray-500">
                {itemData.price} грн
              </p>
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                -{itemData.discount_percentage}%
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-1">
                До кінця знижки:
              </p>
              <CountdownTimer endDate={discountEndDate} />
            </div>
          </>
        ) : (
          <p className="text-2xl font-bold">{itemData.price} грн</p>
        )}

        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium text-gray-700">В наявності:</span>
          <span
            className={`${itemData.stock > 5 ? "text-green-600" : itemData.stock > 0 ? "text-orange-500" : "text-red-600"} font-medium`}
          >
            {itemData.stock > 0 ? itemData.stock : "Немає в наявності"}
          </span>

          {itemData.sales_count > 0 && (
            <span className="text-gray-500 ml-2">
              Продано: {itemData.sales_count}
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
        <h3 className="font-medium text-gray-800">Доставка та оплата:</h3>
        <div className="flex items-center gap-3">
          <div className="text-green-600">
            <BadgeCheck />
          </div>
          <p className="text-sm">
            Безкоштовна доставка при замовленні від 2000 грн
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-blue-600">
            <Truck />
          </div>
          <p className="text-sm">Доставка протягом 2-3 робочих днів</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-orange-600">
            <Heart />
          </div>
          <p className="text-sm">Повернення протягом 14 днів</p>
        </div>
      </div>
    </div>
  );
};
