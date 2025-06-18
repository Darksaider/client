import React, { useRef, useState, useMemo } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import sliderImg from "../assets/ArrowSlider.svg";
import { useProducts } from "../hooks/useProduct";
import { ProductItem } from "./ProductItem";

export const Slider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: products, isLoading } = useProducts("hasDiscount=true");

  const swiperRef = useRef<SwiperClass | null>(null);

  // Дублюємо товари, якщо їх менше 4
  const processedProducts = useMemo(() => {
    if (!products?.products) return [];

    const originalProducts = products.products;

    if (originalProducts.length < 4) {
      // Дублюємо товари, щоб отримати достатню кількість для коректної роботи слайдера
      const duplicatedProducts = [...originalProducts, ...originalProducts];
      return duplicatedProducts;
    }

    return originalProducts;
  }, [products]);

  const goToSlide = (index: number) => {
    swiperRef.current?.slideToLoop(index);
    setActiveIndex(index);
  };

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
  };

  if (isLoading || !products) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3 justify-center mt-auto mr-5">
        <button
          onClick={handlePrev}
          className="w-[48px] h-[48px] text-gray-800 font-bold py-2 px-4 rounded-full rotate-180 flex justify-center items-center border shadow-md cursor-pointer"
        >
          <img className="h-[20px]" src={sliderImg} alt="" />
        </button>
        <button
          onClick={handleNext}
          className="w-[48px] h-[48px] text-gray-800 font-bold py-2 px-4 rounded-full flex justify-center items-center border shadow-md cursor-pointer"
        >
          <img className="h-[20px]" src={sliderImg} alt="" />
        </button>
      </div>

      <div className="overflow-hidden mx-auto relative">
        <Swiper
          spaceBetween={20}
          slidesPerView={2.5}
          centeredSlides={false}
          onSlideChange={handleSlideChange}
          className="h-full"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
        >
          {processedProducts.map((product, index) => (
            <SwiperSlide key={`${product.id}-${index}`}>
              <div
                className={`relative rounded-lg transition-all duration-500 h-full ${
                  activeIndex === index
                    ? "scale-100 z-10 bg-avocado-400"
                    : "scale-90 opacity-75 bg-amber-800"
                }`}
              >
                <ProductItem product={product} />
              </div>
            </SwiperSlide>
          ))}

          <div className="absolute bottom-[1%] left-1/2 transform -translate-x-1/2 -translate-y-[10%] rounded z-10 flex">
            {/* Використовуємо оригінальну кількість товарів для індикаторів */}
            {products.products.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full mx-1 relative flex items-center justify-center after:content-[''] after:w-2 after:h-2 after:rounded-full cursor-pointer ${
                  activeIndex === index
                    ? "after:bg-black border"
                    : "after:bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
              ></div>
            ))}
          </div>
        </Swiper>
      </div>
    </>
  );
};
