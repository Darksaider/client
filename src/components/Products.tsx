// Products.tsx
import { useProducts } from "../hooks/useProduct";
import { ProductItem } from "./ProductItem";
import { PaginationButtons } from "./Pagination";

export const Products: React.FC = () => {
  const { data: ProductData, isLoading: isLoadingProduct } = useProducts();

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Завантаження продуктів...</p>
        </div>
      </div>
    );
  }

  if (
    !ProductData ||
    !ProductData.data ||
    ProductData.data.products.length === 0
  ) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
          <p className="text-gray-600">Продукти відсутні</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Responsive Grid */}
      <div
        className="grid gap-3 sm:gap-4 p-2 sm:p-4 
                      grid-cols-2 
                      sm:grid-cols-2 
                      md:grid-cols-3 
                      lg:grid-cols-3 
                      xl:grid-cols-4 
                      2xl:grid-cols-5"
      >
        {ProductData.data.products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <PaginationButtons
          productNumber={ProductData.data.productsCourt}
          isLoading={isLoadingProduct}
        />
      </div>
    </div>
  );
};
