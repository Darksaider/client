import { useProducts } from "../hooks/useProduct";
import { ProductItem } from "./ProductItem";
import { PaginationButtons } from "./Pagination";

export const Products: React.FC = () => {
  const { data: ProductData, isLoading: isLoadingProduct } = useProducts();

  if (isLoadingProduct) {
    return <div>Завантаження продуктів...</div>;
  }

  if (
    !ProductData ||
    !ProductData.data ||
    ProductData.data.products.length === 0
  ) {
    return <div>Продукти відсутні</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-4.5 p-2.5 w-full">
      {ProductData.data.products.map((product) => (
        <ProductItem
          key={product.id}
          className="bg-amber-300"
          product={product}
        />
      ))}
      <PaginationButtons
        productNumber={ProductData.data.productsCourt}
        isLoading={isLoadingProduct}
      />
    </div>
  );
};
