import { memo, useState, useCallback } from "react";

type StarRatingProps = {
  rating: number;
  setRating?: (r: number) => void; // якщо не передано — тільки для читання
  size?: "sm" | "md" | "lg";
  className?: string;
};

export const StarRating = memo(
  ({ rating, setRating, size = "md", className = "" }: StarRatingProps) => {
    const [hover, setHover] = useState(0);
    const editable = typeof setRating === "function";

    const handleMouseEnter = useCallback(
      (index: number) => {
        if (editable) setHover(index);
      },
      [editable],
    );

    const handleMouseLeave = useCallback(() => {
      if (editable) setHover(0);
    }, [editable]);

    const handleClick = useCallback(
      (index: number) => {
        if (editable) setRating(index);
      },
      [editable, setRating],
    );

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "text-xl sm:text-lg";
        case "lg":
          return "text-4xl sm:text-3xl";
        default:
          return "text-3xl sm:text-2xl";
      }
    };

    return (
      <div
        className={`flex items-center justify-center sm:justify-start space-x-1 ${className}`}
      >
        {[1, 2, 3, 4, 5].map((index) => {
          const filled = index <= (hover || rating);
          return (
            <button
              key={index}
              type="button"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(index)}
              className={`
                ${getSizeClasses()} 
                p-1 transition-all duration-200 
                ${filled ? "text-yellow-400" : "text-gray-300"}
                ${editable ? "hover:text-yellow-400 hover:scale-110 active:scale-95" : "cursor-default"}
              `}
              disabled={!editable}
              aria-label={
                editable ? `Встановити рейтинг ${index}` : `Рейтинг ${index}`
              }
            >
              ★
            </button>
          );
        })}
      </div>
    );
  },
);
