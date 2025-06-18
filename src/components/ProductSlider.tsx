import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  Thumbs,
  EffectFade,
  Scrollbar,
  Pagination,
} from "swiper/modules";

import type { Swiper as SwiperCore } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import { useState, useRef } from "react";

// Кастомний компонент для зуму зображення
const CustomImageZoom = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    // Отримуємо координати миші відносно контейнера
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Обчислюємо відсоток позиції
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Обмежуємо діапазон від 10% до 90% щоб уникнути проблем з краями
    const clampedX = Math.max(10, Math.min(90, xPercent));
    const clampedY = Math.max(10, Math.min(90, yPercent));

    setZoomPosition({ x: clampedX, y: clampedY });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-zoom-in overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`${className} transition-transform duration-200 ${
          isZoomed ? "scale-200" : "scale-100"
        }`}
        style={{
          transformOrigin: isZoomed
            ? `${zoomPosition.x}% ${zoomPosition.y}%`
            : "center",
          objectPosition: "center",
        }}
      />
    </div>
  );
};

const MobileImages = ({ productImages }: { productImages: string[] }) => {
  return (
    <div className="block lg:hidden">
      <div className="mb-4">
        <Swiper
          spaceBetween={10}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="h-80 sm:h-96 rounded-lg"
        >
          {productImages.length > 0 ? (
            productImages.map((imgUrl, index) => (
              <SwiperSlide
                key={`mobile-${index}`}
                className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={imgUrl}
                  alt={`Зображення ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center" }}
                />
              </SwiperSlide>
            ))
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <p>Зображення відсутнє</p>
            </div>
          )}
        </Swiper>
      </div>
    </div>
  );
};

const DesktopImages = ({ productImages }: { productImages: string[] }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  return (
    <div className="hidden lg:flex flex-col md:flex-row gap-4 md:h-[540px]">
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
                  style={{ objectPosition: "center" }}
                />
              </SwiperSlide>
            ))
          ) : (
            <p className="text-center p-4">Немає зображень</p>
          )}
        </Swiper>
      </div>

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
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <CustomImageZoom
                    src={imgUrl}
                    alt={`Зображення ${index + 1}`}
                    className="w-full h-full object-cover"
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
  );
};

export const ProductImages = ({ images }: { images: string[] }) => {
  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4">
        <MobileImages productImages={images} />
        <DesktopImages productImages={images} />
      </div>
    </>
  );
};
