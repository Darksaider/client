import { useParams } from "react-router";
import React, { useState } from "react"; // Додано useMemo

// Імпорти Swiper React компонентів
import { Swiper, SwiperSlide } from "swiper/react";
// Імпорти модулів Swiper (додано EffectFade)
import {
  FreeMode,
  Navigation,
  Thumbs,
  EffectFade,
  Scrollbar,
} from "swiper/modules";

// Тип для Swiper instance (для TypeScript)
import type { Swiper as SwiperCore } from "swiper";

// Імпорти Swiper стилів (додано effect-fade)
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "swiper/css/scrollbar"; // <-- Додано CSS для Fade ефекту
import { useProductItem } from "../../hooks/useProductItem";

// Припустимо, твій useProductItem повертає такий тип (адаптуй!)
const productImages = [
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://png.pngtree.com/thumb_back/fw800/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
];

// Більше не потрібен ProductGalleryProps, компонент отримує дані сам
export const ProductPage: React.FC = () => {
  const { id: productId } = useParams<{ id?: string }>();
  const productIdNumber = productId ? parseInt(productId, 10) : null;
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
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  // Використовуємо хук для отримання даних товару

  // --- Обробка станів завантаження / помилки ---
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

  if (productImages.length === 0) {
    return (
      <div className="p-4">
        <h1>{itemData.data.name}</h1>
        <p>{itemData.data.description}</p>
        <p className="mt-4 text-gray-500">(Зображення відсутні)</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{itemData.data.name}</h1>
      </div>
      <p className="mb-6">{itemData.data.description}</p>{" "}
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction={"vertical"}
          spaceBetween={10}
          slidesPerView={5} // Можна налаштувати
          freeMode={true}
          scrollbar={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs, Scrollbar]}
          // Задаємо фіксовану ширину та висоту
          className="w-20 md:w-24 h-[300px] md:h-[450px] flex-shrink-0 order-first md:order-none "
        >
          {productImages.map((imgUrl, index) => (
            <SwiperSlide
              key={`thumb-${index}`}
              className={`
                                opacity-60 hover:opacity-100 cursor-pointer
                                border-2 border-transparent
                                transition-opacity duration-300 ease-in-out
                                flex justify-center items-center overflow-hidden
                                [&.swiper-slide-thumb-active]:opacity-100
                                [&.swiper-slide-thumb-active]:border-blue-500
                            `}
            >
              <img
                src={imgUrl}
                alt={`Мініатюра ${index + 1}`}
                className="block w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          // Основні налаштування
          spaceBetween={10}
          effect={"fade"} // <-- Встановлюємо ефект Fade
          fadeEffect={{ crossFade: true }} // <-- Опціонально: плавний перехід
          // Підключаємо мініатюри
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs, EffectFade]}
          className="w-full md:w-[300px] h-[300px] md:h-[450px] relative flex-shrink-0 mx-auto md:mx-0"
        >
          {productImages.map((imgUrl, index) => (
            <SwiperSlide
              key={`main-${index}`}
              className="flex justify-center items-center bg-gray-100"
            >
              <img
                src={imgUrl}
                alt={`Зображення ${index + 1}`}
                className="block max-w-full max-h-full object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex-1">
          <p className="text-xl font-semibold">Ціна: {itemData.data.price}</p>
        </div>
      </div>
    </div>
  );
};
