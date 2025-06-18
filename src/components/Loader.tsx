import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = "md",
  variant = "primary",
  text = "Завантаження...",
  fullScreen = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const variantClasses = {
    primary: "border-indigo-600",
    secondary: "border-gray-600",
    success: "border-green-600",
    warning: "border-yellow-600",
    danger: "border-red-600",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center py-8";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-4">
        {/* Основний спіннер */}
        <div className="relative">
          {/* Фоновий круг */}
          <div
            className={`${sizeClasses[size]} border-4 border-gray-200 rounded-full`}
          />

          {/* Анімований круг */}
          <div
            className={`${sizeClasses[size]} border-4 ${variantClasses[variant]} border-t-transparent rounded-full animate-spin absolute top-0 left-0`}
          />

          {/* Внутрішній пульсуючий круг */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${variantClasses[variant].replace("border-", "bg-")} rounded-full animate-pulse`}
          />
        </div>

        {/* Текст */}
        {text && (
          <div
            className={`${textSizeClasses[size]} font-medium text-gray-700 animate-pulse`}
          >
            {text}
          </div>
        )}

        {/* Додаткові точки */}
        <div className="flex space-x-1">
          <div
            className={`w-2 h-2 ${variantClasses[variant].replace("border-", "bg-")} rounded-full animate-bounce`}
            style={{ animationDelay: "0ms" }}
          />
          <div
            className={`w-2 h-2 ${variantClasses[variant].replace("border-", "bg-")} rounded-full animate-bounce`}
            style={{ animationDelay: "150ms" }}
          />
          <div
            className={`w-2 h-2 ${variantClasses[variant].replace("border-", "bg-")} rounded-full animate-bounce`}
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

// Додатковий компонент для скелетону
const SkeletonLoader: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = "",
}) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Компонент для демонстрації різних варіантів
