import { useFavorites } from "../hooks/useFavorite";
import { useAuthContext } from "../hooks/useLoginContext";
import { useProductCart } from "../hooks/useProductCart";
import { useSelectedProductForCart } from "../pages/client/useSelectedProductForCart";
import { Product } from "../types/product.type";
interface ProductActionProps {
  productId: number;
  itemData: Product;
}
export const ProductAction = ({ productId, itemData }: ProductActionProps) => {
  const { isLoggedIn } = useAuthContext();
  const { selectedColor, selectedSize, setSelectedColor, setSelectedSize } =
    useSelectedProductForCart(productId);
  const { toggleCartItem, isInCart } = useProductCart(
    +productId,
    selectedColor,
    selectedSize,
    isLoggedIn,
  );
  const { isInFavorites, toggleFavorite } = useFavorites(
    isLoggedIn,
    +productId,
  );
  return (
    <div>
      {itemData.product_colors && itemData.product_colors.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-base sm:text-lg font-medium mb-3">Колір:</h3>
          <div className="flex flex-wrap gap-3">
            {itemData.product_colors.map((option) => (
              <label
                key={option.color_id}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="radio"
                  name="productColor"
                  value={option.color_id}
                  className="sr-only peer"
                  checked={selectedColor === option.color_id}
                  onChange={() => setSelectedColor(option.color_id)}
                />
                <span
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border cursor-pointer transition-all duration-200 ease-in-out
                        peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-blue-500
                        hover:ring-1 hover:ring-gray-400
                        ${selectedColor === option.color_id ? "ring-2 ring-offset-1 ring-blue-500" : "border-gray-300"}`}
                  style={{ backgroundColor: option.colors.hex_code }}
                  title={option.colors.name}
                ></span>
                <span className="ml-2 text-xs sm:text-sm text-gray-700">
                  {option.colors.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Вибір розміру */}
      {itemData.product_sizes && itemData.product_sizes.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-medium mb-3">Розмір:</h3>
          <div className="flex flex-wrap gap-2">
            {itemData.product_sizes.map((option) => (
              <label key={option.size_id} className="cursor-pointer">
                <input
                  type="radio"
                  name="productSize"
                  className="sr-only"
                  checked={selectedSize === option.size_id}
                  onChange={() => setSelectedSize(option.size_id)}
                />
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 border rounded-md text-sm ${
                    selectedSize === option.size_id
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {option.sizes.size}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Теги */}
      {itemData.product_tags && itemData.product_tags.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm text-gray-700 font-medium">Теги:</span>
          <div className="flex flex-wrap gap-2">
            {itemData.product_tags.map((tag) => (
              <span
                key={tag.tag_id}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {tag.tags.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Кнопки дій */}
      <div className="sticky bottom-0 bg-white p-3 border-t -mx-2 sm:-mx-4">
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={toggleCartItem}
            disabled={itemData.stock <= 0}
            className={`flex-1 px-3 py-3 sm:px-4 rounded-md transition-colors text-center font-medium text-sm sm:text-base ${
              itemData.stock <= 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isInCart
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {itemData.stock <= 0
              ? "Немає в наявності"
              : isInCart
                ? "Видалити з кошика"
                : "До кошика"}
          </button>

          <button
            onClick={toggleFavorite}
            className={`px-3 py-3 sm:px-4 rounded-md transition-colors whitespace-nowrap text-sm sm:text-base ${
              isInFavorites
                ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isInFavorites ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </div>
  );
};
