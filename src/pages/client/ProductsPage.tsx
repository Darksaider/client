import { Filter } from "../../components/Filter";
import { Products } from "../../components/Products";
import { SkeletonProductPageLoader } from "../../components/skeleton/ProductLoadingSkeleton";
import { useFilter } from "../../hooks/useFilter";
import { useProducts } from "../../hooks/useProduct";

export const ProductsPage: React.FC = () => {
  const { data: filterData, isLoading: isLoadingFilterData } = useFilter(true);
  const {
    data: ProductData,
    isLoading: isLoadingProduct,
    isFetching,
  } = useProducts();
  if (isLoadingFilterData && isLoadingProduct) {
    return <SkeletonProductPageLoader />;
  }
  if (filterData === undefined || ProductData === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Помилка завантаження даних
          </h1>
          <p className="text-gray-600">Вибачте за тимчасові не зручності .</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Filter data={filterData} />
      <Products
        ProductData={ProductData}
        isLoading={isLoadingProduct || isFetching}
      />
    </div>
  );
};
