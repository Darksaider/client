import { Order } from "../components/UserOrders";

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
export const getStatusConfig = (status: Order["status"]) => {
  const configs = {
    pending: {
      label: "Очікує підтвердження",
      bgColor: "bg-gradient-to-r from-yellow-50 to-amber-50",
      textColor: "text-yellow-700",
      borderColor: "border-yellow-200",
      icon: "🕒",
      iconBg: "bg-yellow-100",
    },
    confirmed: {
      label: "Підтверджено",
      bgColor: "bg-gradient-to-r from-sky-50 to-blue-50",
      textColor: "text-sky-700",
      borderColor: "border-sky-200",
      icon: "✔️",
      iconBg: "bg-sky-100",
    },
    processing: {
      label: "Обробка",
      bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      icon: "⚙️",
      iconBg: "bg-blue-100",
    },
    shipped: {
      label: "В дорозі",
      bgColor: "bg-gradient-to-r from-purple-50 to-indigo-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      icon: "🚚",
      iconBg: "bg-purple-100",
    },
    delivered: {
      label: "Отримано",
      bgColor: "bg-gradient-to-r from-emerald-50 to-green-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      icon: "✅",
      iconBg: "bg-emerald-100",
    },
    returned: {
      label: "Повернено",
      bgColor: "bg-gradient-to-r from-gray-50 to-slate-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      icon: "↩️",
      iconBg: "bg-gray-100",
    },
    cancelled: {
      label: "Скасовано",
      bgColor: "bg-gradient-to-r from-red-50 to-rose-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      icon: "❌",
      iconBg: "bg-red-100",
    },
  };

  return configs[status] || configs["pending"];
};
export const getPaymentStatusConfig = (status: Order["payment_status"]) => {
  const configs = {
    awaiting: {
      label: "Очікує оплати",
      bgColor: "bg-gradient-to-r from-orange-50 to-amber-50",
      textColor: "text-orange-700",
      borderColor: "border-orange-200",
      icon: "⏰",
    },
    completed: {
      label: "Оплачено",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      icon: "💳",
    },
    failed: {
      label: "Не вдалося",
      bgColor: "bg-gradient-to-r from-rose-50 to-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      icon: "❗",
    },
    expired: {
      label: "Прострочено",
      bgColor: "bg-gradient-to-r from-gray-50 to-zinc-50",
      textColor: "text-zinc-700",
      borderColor: "border-zinc-200",
      icon: "⌛",
    },
    refunded: {
      label: "Повернено",
      bgColor: "bg-gradient-to-r from-gray-50 to-slate-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
      icon: "↩️",
    },
  };

  return configs[status] || configs["awaiting"];
};
