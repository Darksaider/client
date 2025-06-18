import { Loader } from "../../components/Loader";
import { ProductItem } from "../../components/ProductItem";
import { useFavorites } from "../../hooks/useFavorite";

export const FavoritePage = () => {
  const { data: favoriteData, isLoading } = useFavorites(true);
  if (isLoading) {
    return (
      <div className="black flex justify-center items-center min-h-[400px] p-8 w-full">
        <Loader size="xl" variant="success" text="Завантаження даних..." />
      </div>
    );
  }

  if (!favoriteData || !favoriteData) {
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
            Улюблені продукти відсутні
          </h3>
          <p className="text-gray-500 text-sm">
            У вас немає улюблених продуктів. Додайте продукти до обраного, щоб
            вони з'явилися тут.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-2 sm:p-4">
        <div
          className="grid gap-3 sm:gap-4
                     grid-cols-2
                     sm:grid-cols-2
                     md:grid-cols-3
                     lg:grid-cols-4"
        >
          {favoriteData.map((product) => (
            <ProductItem key={product.id} product={product.products} />
          ))}
        </div>
      </div>
    </div>
  );
};
