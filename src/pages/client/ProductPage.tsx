import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  Thumbs,
  EffectFade,
  Scrollbar,
} from "swiper/modules";

import type { Swiper as SwiperCore } from "swiper";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "swiper/css/scrollbar";
import { useProductItem } from "../../hooks/useProductItem";
import { useFavorites } from "../../hooks/useFavorite";
import apiClient from "../../hooks/apiClient";
import { useCarts } from "../../hooks/useCart";
import Comments from "./Comments";

// Компонент таймера зворотного відліку
const CountdownTimer = ({ endDate }: any) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate) - new Date();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num;
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-md border border-red-200">
      <div className="text-red-600 mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div className="text-center">
        <span className="font-bold text-red-600">
          {formatNumber(timeLeft.days)}
        </span>
        <span className="text-xs text-red-500"> дн</span>
      </div>
      <span className="text-red-500">:</span>
      <div className="text-center">
        <span className="font-bold text-red-600">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="text-xs text-red-500"> год</span>
      </div>
      <span className="text-red-500">:</span>
      <div className="text-center">
        <span className="font-bold text-red-600">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="text-xs text-red-500"> хв</span>
      </div>
      <span className="text-red-500">:</span>
      <div className="text-center">
        <span className="font-bold text-red-600">
          {formatNumber(timeLeft.seconds)}
        </span>
        <span className="text-xs text-red-500"> сек</span>
      </div>
    </div>
  );
};

export const ProductPage = () => {
  const { id: productId } = useParams<{ id?: string }>();
  const productIdNumber = productId ? +productId : null;

  const {
    data: itemData,
    isLoading,
    isError,
    error,
  } = productIdNumber !== null
    ? useProductItem(productIdNumber)
    : {
        data: null,
        isLoading: false,
        isError: true,
        error: new Error("Invalid Product ID"),
      };

  const [selectedColor, setSelectedColor] = useState<number | undefined>(
    undefined,
  );
  const [selectedSize, setSelectedSize] = useState<number | undefined>(
    undefined,
  );
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  const { data: itemFavorites, refetch } = useFavorites(true);
  const { data: itemCarts, refetch: refetchCarts } = useCarts(true);

  const isHasFavorites =
    itemFavorites?.some((item) => item.product_id === productIdNumber) ?? false;

  const isHasCart =
    itemCarts?.some(
      (item) =>
        item.products.id === productIdNumber &&
        item.color_id === selectedColor &&
        item.size_id === selectedSize,
    ) ?? false;

  // Встановлення початкових значень для кольору та розміру після завантаження даних
  useEffect(() => {
    if (itemData?.data) {
      if (itemData.data.product_colors?.length > 0) {
        setSelectedColor(itemData.data.product_colors[0].color_id);
      }
      if (itemData.data.product_sizes?.length > 0) {
        setSelectedSize(itemData.data.product_sizes[0].size_id);
      }
    }
  }, [itemData]);

  const favoriteHandler = async () => {
    try {
      if (isHasFavorites) {
        await apiClient.delete(`/favorites/${productId}`);
      } else {
        await apiClient.post("/favorites", { id: productId });
      }
      refetch();
    } catch (error) {
      console.error("Error managing favorite", error);
    }
  };

  const cartHandler = async () => {
    try {
      // Знаходимо точний запис, який потрібно видалити
      const cartItemToDelete = itemCarts?.find(
        (item) =>
          item.products.id === productIdNumber &&
          item.color_id === selectedColor &&
          item.size_id === selectedSize,
      );

      if (isHasCart && cartItemToDelete) {
        // Видаляємо конкретний запис з кошика за його ID
        await apiClient.delete(`/cart/${cartItemToDelete.id}`);
      } else {
        // Додаємо товар з вибраними параметрами
        await apiClient.post("/cart", {
          product_id: productId,
          color_id: selectedColor,
          size_id: selectedSize,
        });
      }
      refetchCarts();
    } catch (error) {
      console.error("Error managing cart", error);
    }
  };

  // Отримуємо фото з даних продукту
  const productImages =
    itemData?.data?.product_photos?.map((photo) => photo.photo_url) || [];

  // Перевіряємо, чи є знижка
  const hasDiscount =
    itemData?.data?.product_discounts &&
    itemData.data.product_discounts.length > 0;

  // Отримуємо дату закінчення знижки, якщо вона є
  const discountEndDate = hasDiscount
    ? itemData.data.product_discounts[0].discounts.end_date
    : null;

  if (isLoading) {
    return <p className="p-4 text-center">Завантаження...</p>;
  }

  if (isError) {
    return (
      <p className="p-4 text-center text-red-600">
        Помилка: {error?.message || "Не вдалося завантажити товар"}
      </p>
    );
  }

  if (!itemData?.data) {
    return <p className="p-4 text-center">Товар не знайдено</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Основний контейнер із сіткою */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col md:flex-row gap-4 md:h-[540px]">
          <div className="order-2 md:order-1 md:w-1/5">
            <Swiper
              onSwiper={setThumbsSwiper}
              direction={"vertical"}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              scrollbar={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Thumbs, Scrollbar]}
              className="h-[300px] md:h-[740px]"
            >
              {productImages.length > 0 ? (
                productImages.map((imgUrl, index) => (
                  <SwiperSlide
                    key={`thumb-${index}`}
                    className={`
                      opacity-60 hover:opacity-100 cursor-pointer
                      border-2 border-transparent
                      transition-opacity duration-300 ease-in-out
                      flex justify-center items-center overflow-hidden
                      [&.swiper-slide-thumb-active]:opacity-100
                      [&.swiper-slide-thumb-active]:border-black rounded-md
                    `}
                  >
                    <img
                      src={imgUrl}
                      alt={`Мініатюра ${index + 1}`}
                      className="block w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))
              ) : (
                <p className="text-center p-4">Немає зображень</p>
              )}
            </Swiper>
          </div>

          {/* Основне зображення */}
          <div className="order-1 md:order-2 md:w-4/5">
            <Swiper
              spaceBetween={10}
              effect={"fade"}
              fadeEffect={{ crossFade: true }}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[FreeMode, Navigation, Thumbs, EffectFade]}
              className="h-[300px] md:h-[740px] relative rounded-md"
            >
              {productImages.length > 0 ? (
                productImages.map((imgUrl, index) => (
                  <SwiperSlide
                    key={`main-${index}`}
                    className="flex justify-center items-center bg-gray-100 rounded-md h-full"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={imgUrl}
                        alt={`Зображення ${index + 1}`}
                        className="max-w-full max-h-full object-contain mx-auto"
                        style={{ maxHeight: "100%", width: "auto" }}
                      />
                    </div>
                  </SwiperSlide>
                ))
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-md">
                  <p>Зображення відсутнє</p>
                </div>
              )}
            </Swiper>
          </div>
        </div>

        {/* Права колонка з інформацією про товар */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {itemData.data.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              {itemData.data.product_brands &&
                itemData.data.product_brands.length > 0 && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                    Бренд: {itemData.data.product_brands[0].brands.name}
                  </span>
                )}

              {itemData.data.product_categories &&
                itemData.data.product_categories.length > 0 && (
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
                    Категорія:{" "}
                    {itemData.data.product_categories
                      .map((cat) => cat.categories.name)
                      .join(", ")}
                  </span>
                )}
            </div>

            <p className="text-gray-700">{itemData.data.description}</p>
          </div>

          {/* Ціна з урахуванням знижки */}
          <div className="space-y-3 border-b pb-4">
            {hasDiscount ? (
              <>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-red-600 mr-3">
                    {itemData.data.discounted_price} грн
                  </p>
                  <p className="text-lg line-through text-gray-500">
                    {itemData.data.price} грн
                  </p>
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
                    -{itemData.data.discount_percentage}%
                  </span>
                </div>

                {/* Таймер зворотного відліку */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    До кінця знижки:
                  </p>
                  <CountdownTimer endDate={discountEndDate} />
                </div>
              </>
            ) : (
              <p className="text-2xl font-bold">{itemData.data.price} грн</p>
            )}

            {/* Кількість товарів */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium text-gray-700">В наявності:</span>
              <span
                className={`${itemData.data.stock > 5 ? "text-green-600" : itemData.data.stock > 0 ? "text-orange-500" : "text-red-600"} font-medium`}
              >
                {itemData.data.stock > 0
                  ? itemData.data.stock
                  : "Немає в наявності"}
              </span>

              {itemData.data.sales_count > 0 && (
                <span className="text-gray-500 ml-2">
                  Продано: {itemData.data.sales_count}
                </span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-800">Доставка та оплата:</h3>
            <div className="flex items-center gap-3">
              <div className="text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <p className="text-sm">
                Безкоштовна доставка при замовленні від 2000 грн
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <p className="text-sm">Доставка протягом 2-3 робочих днів</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-orange-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <p className="text-sm">Повернення протягом 14 днів</p>
            </div>
          </div>

          {/* Вибір кольору */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Колір:</h3>
            <div className="flex flex-wrap gap-2">
              {itemData.data.product_colors?.map((option) => (
                <label
                  key={option.color_id}
                  className="flex items-center cursor-pointer mr-3 mb-2"
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
                    className={`w-6 h-6 rounded-full border cursor-pointer transition-all duration-200 ease-in-out
                      peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-blue-500
                      hover:ring-1 hover:ring-gray-400
                      ${selectedColor === option.color_id ? "ring-2 ring-offset-1 ring-blue-500" : "border-gray-300"}`}
                    style={{ backgroundColor: option.colors.hex_code }}
                    title={option.colors.name}
                  ></span>
                  <span className="ml-1 text-sm text-gray-700">
                    {option.colors.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Вибір розміру */}
          <div>
            <h3 className="text-lg font-medium mb-2">Розмір:</h3>
            <div className="flex flex-wrap gap-2">
              {itemData.data.product_sizes?.map((option) => (
                <label key={option.size_id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="productSize"
                    className="sr-only"
                    checked={selectedSize === option.size_id}
                    onChange={() => setSelectedSize(option.size_id)}
                  />
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 border rounded-md ${
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

          {/* Теги */}
          {itemData.data.product_tags &&
            itemData.data.product_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-sm text-gray-700 mr-2">Теги:</span>
                {itemData.data.product_tags.map((tag) => (
                  <span
                    key={tag.tag_id}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {tag.tags.name}
                  </span>
                ))}
              </div>
            )}

          {/* Кнопки дій */}
          <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t">
            <button
              onClick={cartHandler}
              disabled={itemData.data.stock <= 0}
              className={`flex-1 px-4 py-3 rounded-md transition-colors text-center font-medium ${
                itemData.data.stock <= 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : isHasCart
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                    : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {itemData.data.stock <= 0
                ? "Немає в наявності"
                : isHasCart
                  ? "Видалити з кошика"
                  : "Додати до кошика"}
            </button>

            <button
              onClick={favoriteHandler}
              className={`px-4 py-3 rounded-md transition-colors ${
                isHasFavorites
                  ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isHasFavorites ? "Видалити з улюблених" : "Додати до улюблених"}
            </button>
          </div>
        </div>
      </div>
      <Comments productId={productId} />
    </div>
  );
};
