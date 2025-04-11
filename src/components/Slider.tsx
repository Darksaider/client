import React, { useRef, useState } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import sliderImg from "../assets/ArrowSlider.svg";
interface Product {
  id: number;
  image: string;
  title: string;
  discount: string;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    image: "/images/black-dress.jpg",
    title: "30% OFF",
    discount: "30% OFF",
    category: "Spring Sale",
  },
  {
    id: 2,
    image: "/images/blue-dress.jpg",
    title: "40% OFF",
    discount: "40% OFF",
    category: "Summer Collection",
  },
  {
    id: 3,
    image: "/images/casual-outfit.jpg",
    title: "25% OFF",
    discount: "25% OFF",
    category: "Casual Wear",
  },
  {
    id: 4,
    image: "/images/casual-outfit.jpg",
    title: "25% OFF",
    discount: "25% OFF",
    category: "Casual Wear",
  },
];

export const Slider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const goToSlide = (index: number) => {
    swiperRef.current?.slideToLoop(index); // Use swiperRef
    setActiveIndex(index); // Update state
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

  return (
    <>
      <div className="flex gap-3 justify-center mt-auto mr-5">
        <button
          onClick={handlePrev}
          className="w-[48px] h-[48px] \ text-gray-800 font-bold py-2 px-4 rounded-full rotate-180 flex justify-center items-center border  shadow-md  cursor-pointer"
        >
          <img className="h-[20px]" src={sliderImg} alt="" />
        </button>
        <button
          onClick={handleNext}
          className=" w-[48px] h-[48px]  text-gray-800 font-bold py-2 px-4 rounded-full flex justify-center items-center  border shadow-md cursor-pointer"
        >
          <img className="h-[20px]" src={sliderImg} alt="" />
        </button>
      </div>

      <div className="overflow-hidden mx-auto relative ">
        {" "}
        {/* Make container relative for absolute positioning */}
        <Swiper
          spaceBetween={20}
          slidesPerView={2.5}
          centeredSlides={false}
          //navigation - видаляємо стандартну навігацію, щоб бачити лише кастомні
          onSlideChange={handleSlideChange}
          className="h-full "
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id}>
              <div
                className={`relative rounded-lg transition-all duration-500 h-full  ${activeIndex === index ? "scale-100 z-10 bg-avocado-400" : "scale-90 opacity-75  bg-amber-800"}`}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
                <div
                  className={`absolute bottom-4 left-4 bg-white p-3 rounded shadow transition-all ${
                    activeIndex === index ? "bg-blue-50 shadow-lg" : ""
                  }`}
                >
                  <div className="text-sm text-gray-500">
                    {product.id} — {product.category}
                  </div>
                  <div
                    className={`font-bold ${activeIndex === index ? "text-blue-600" : ""}`}
                  >
                    {product.discount}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="absolute bottom-[1%] left-1/2 transform -translate-x-1/2 -translate-y-[10%] rounded  z-10 flex">
            {products.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full mx-1 relative flex items-center justify-center after:content-['']  after:w-2 after:h-2 after:rounded-full cursor-pointer ${activeIndex === index ? "after:bg-black border" : "after:bg-gray-400"}`}
                onClick={() => goToSlide(index)}
              ></div>
            ))}
          </div>
        </Swiper>
      </div>
    </>
  );
};
