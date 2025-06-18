// components/skeletons/OrdersSkeleton.tsx
import React from "react";

export const OrdersSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-6 flex flex-col gap-4 animate-pulse"
        >
          {/* Верхній рядок: Заголовок + Ціна */}
          <div className="flex justify-between items-center">
            <div className="w-32 h-5 bg-gray-200 rounded" />
            <div className="w-24 h-6 bg-gray-200 rounded" />
          </div>

          {/* Статуси */}
          <div className="flex gap-3">
            <div className="w-28 h-8 bg-gray-200 rounded-full" />
            <div className="w-28 h-8 bg-gray-200 rounded-full" />
          </div>

          {/* Нижній рядок: Дата, Адреса, Оплата */}
          <div className="flex gap-4 flex-wrap">
            <div className="w-44 h-5 bg-gray-200 rounded" />
            <div className="w-32 h-5 bg-gray-200 rounded" />
            <div className="w-24 h-5 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
