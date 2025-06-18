// Products.tsx
import { ProductItem } from "./ProductItem";
import { PaginationButtons } from "./Pagination";
import { ProductsType } from "../types/product.type";
import { SortBy } from "./sortBy";
import { Loader } from "./Loader";

interface ProductDataProps {
  ProductData: ProductsType;
  isLoading: boolean;
}
export const Products = ({ ProductData, isLoading }: ProductDataProps) => {
  if (isLoading) {
    return (
      <div className="black flex justify-center items-center min-h-[400px] p-8 w-full">
        <Loader size="xl" variant="success" text="Завантаження даних..." />
      </div>
    );
  }

  if (!ProductData || !ProductData || ProductData.products.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-8 w-full">
        <div className="text-center">
          <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Продукти відсутні
          </h3>
          <p className="text-gray-500 text-sm">
            На даний момент немає доступних продуктів
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <SortBy />
      <div className="p-2 sm:p-4">
        <div
          className="grid gap-3 sm:gap-4
                     grid-cols-2
                     sm:grid-cols-2
                     md:grid-cols-3
                     lg:grid-cols-4"
        >
          {ProductData.products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center p-2 sm:p-4">
        <PaginationButtons
          productNumber={ProductData.totalCount}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
