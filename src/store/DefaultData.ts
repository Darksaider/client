import reviewSlideImage1 from "../assets/reviewSlide1.png";
import reviewSlideImage2 from "../assets/reviewSlide2.png";
import reviewSlideImage3 from "../assets/reviewSlide3.png";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
  imageSrc: string;
}
export const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "James K.",
    role: "Traveler",
    text: "You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!",
    rating: 5,
    imageSrc: reviewSlideImage1,
  },
  {
    id: 2,
    name: "Sarah W.",
    role: "Designer",
    text: "I was looking for. Thank you for making it hassle free! All the great.",
    rating: 5,
    imageSrc: reviewSlideImage2,
  },
  {
    id: 3,
    name: "Megen W.",
    role: "Business Owner",
    text: "“Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.”",
    rating: 4,
    imageSrc: reviewSlideImage3,
  },
];
