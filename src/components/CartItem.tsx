import { NavLink } from "react-router";
import { ClientCartItem } from "../types/types";
import { useProductCart } from "../hooks/useProductCart";
import { useAuth } from "../hooks/useLogin";
import { useUpdateCartItemQuantity } from "../hooks/useCart";

interface CartItemProps {
  item: ClientCartItem;
  index: number;
}

export const CartItem: React.FC<CartItemProps> = ({ item, index }) => {
  const product = item;
  const imageUrl =
    product.photo_url?.length > 0 ? product.photo_url : "/placeholder.jpg";

  // Use discounted price if available

  const hasDiscount = item.discount_percentage ?? 0;

  const { isLoggedIn } = useAuth();
  const price = hasDiscount ? item.discounted_price : product.price;
  // const [quantity, setQuantity] = useState<number>(initialQuantity);
  // const debouncedQuantity = useDebounce(quantity, 500);

  const { removeCart } = useProductCart(
    item.product_id,
    item.color.id,
    item.size.id,
    isLoggedIn,
  );

  const updateQuantityMutation = useUpdateCartItemQuantity();

  // Обробники для зміни кількості
  const handleIncrease = () => {
    updateQuantityMutation.mutate({
      itemId: item.cartId,
      quantity: item.quantity + 1,
    });
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantityMutation.mutate({
        itemId: item.cartId,
        quantity: item.quantity - 1,
      });
    }
  };

  const handleRemove = async () => {
    await removeCart(item.cartId);
  };

  const bgColor = index % 2 === 0 ? "bg-white" : "bg-gray-200";

  return (
    <div
      className={`flex items-start space-x-4 p-4 ${bgColor} first:rounded-t-lg last:rounded-b-lg relative mb-1.5`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.name}
          className="h-24 w-24 rounded-md object-cover"
        />
      </div>

      <div className="flex flex-grow flex-col justify-between h-24">
        <div>
          <NavLink
            to={`/products/${product.product_id}`}
            className="mb-1 block font-medium text-gray-900 hover:text-blue-600 text-base"
          >
            {item.name}
          </NavLink>

          {hasDiscount ? (
            <div className="flex items-baseline space-x-2">
              <p className="text-sm text-red-600 font-medium">
                {item.discounted_price} грн
              </p>
              <p className="text-xs text-gray-500 line-through">{price} грн</p>
              <span className="px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                -{item.discount_percentage}%
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-700">Ціна: {product.price} грн</p>
          )}
        </div>

        <div className="flex items-center justify-start mt-2">
          <div className="flex items-center space-x-2 rounded border border-gray-300">
            <button
              onClick={handleDecrease}
              disabled={item.quantity === 1 || updateQuantityMutation.isPending}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l"
              aria-label="Зменшити кількість"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </button>

            <span className="px-3 text-sm font-medium text-gray-800 relative">
              {item.quantity ?? 1}
              {updateQuantityMutation.isPending && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              )}
            </span>

            <button
              onClick={handleIncrease}
              disabled={updateQuantityMutation.isPending}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r"
              aria-label="Збільшити кількість"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>

          {updateQuantityMutation.isError && (
            <span className="ml-2 text-xs text-red-600">Помилка оновлення</span>
          )}
        </div>
      </div>

      <button
        onClick={handleRemove}
        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        aria-label={`Видалити ${product.name}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
