import React, { useRef } from "react";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import sliderArrow from "./assets/ArrowSlider.svg";
import { StarRating } from "./UI/StarRating";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating?: number;
  imageSrc: string;
}

interface TestimonialSlideProps {
  item: Testimonial;
}

export const TestimonialSlide: React.FC<TestimonialSlideProps> = ({ item }) => {
  return (
    <div className="p-9 mb-4 bg-white flex text-black items-center justify-center rounded-lg shadow-lg gap-15 h-full">
      <img
        src={item.imageSrc}
        alt={item.name}
        className="w-1/2 rounded-full object-cover"
        style={{ maxWidth: "150px", maxHeight: "150px" }}
      />
      <div className="flex flex-col items-start w-1/2">
        <p className="text-lg text-center">{item.text}</p>
        {item.rating && <StarRating rating={item.rating} />}
        <h3 className="font-bold mt-2">{item.name}</h3>
        <p className="text-sm">{item.role}</p>
      </div>
    </div>
  );
};

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({
  testimonials,
}) => {
  let testimonialsSlide = [...testimonials];
  const swiperRef = useRef<SwiperClass | null>(null);
  const slidesPerView = 2.29;
  if (slidesPerView * 2 > testimonials.length) {
    testimonialsSlide = [...testimonials, ...testimonials];
  }
  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <div className="w-full ">
      <Swiper
        modules={[EffectCoverflow]}
        loop={true}
        speed={1000}
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={slidesPerView}
        coverflowEffect={{
          rotate: 0,
          stretch: 80,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        }}
        style={{ height: "350px" }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {testimonialsSlide.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <TestimonialSlide item={testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex justify-center gap-2">
        <button
          onClick={handlePrev}
          className="w-[48px] h-[48px] text-gray-800 font-bold py-2 px-4 rounded-full rotate-180 flex justify-center items-center border shadow-md cursor-pointer "
        >
          <img className="h-[20px]" src={sliderArrow} alt="" />
        </button>
        <button
          onClick={handleNext}
          className=" w-[48px] h-[48px]  text-gray-800 font-bold py-2 px-4 rounded-full flex justify-center items-center  border shadow-md cursor-pointer"
        >
          <img className="h-[20px]" src={sliderArrow} alt="" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
