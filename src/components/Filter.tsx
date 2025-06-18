import React, { useState, useEffect } from "react";
import { useProductFilters } from "../hooks/useFilterParams";
import { IFilter } from "../types/types";

interface IFilterProps {
  data: IFilter;
}

export const Filter = ({ data }: IFilterProps) => {
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  });
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setPriceRange({
      min: filters.minPrice || "",
      max: filters.maxPrice || "",
    });
    setSearchQuery(filters.search || "");
  }, [filters.minPrice, filters.maxPrice, filters.search]);

  // Блокуємо скрол коли мобільний фільтр відкритий
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFilterOpen]);

  const handleCheckboxChange = (
    type: "colors" | "sizes" | "tags" | "categories" | "brands",
    id: number,
    checked: boolean,
  ) => {
    const currentValues = filters[type] || [];
    const newValues = checked
      ? [...new Set([...currentValues, id])]
      : currentValues.filter((item) => item !== id);

    updateFilters({
      [type]: newValues.length > 0 ? newValues : undefined,
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchQuery || undefined });
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: priceRange.min ? Number(priceRange.min) : undefined,
      maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
    });
  };

  const renderFilterSection = (
    title: string,
    type: "categories" | "brands" | "tags",
    options: Array<{ id: number; name: string }>,
  ) => (
    <div className="mb-6">
      <h3 className="font-medium mb-3 text-gray-800">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
        {options?.map((option) => (
          <label
            key={option.id}
            className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
          >
            <input
              type="checkbox"
              className="mr-3 w-4 h-4 flex-shrink-0"
              checked={filters[type]?.includes(option.id) || false}
              onChange={(e) =>
                handleCheckboxChange(type, option.id, e.target.checked)
              }
            />
            <span className="text-sm truncate">{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden lg:block filter-container p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        {/* Пошук */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-gray-800">Пошук</h3>
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Пошук продуктів..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-3 text-white bg-black hover:bg-gray-800 rounded-r-md transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>

        {/* Ціна */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-gray-800">Ціна</h3>
          <form
            onSubmit={handlePriceSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="flex gap-2 items-center">
              <input
                type="number"
                className="w-20 sm:w-24 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Мін.."
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                min="0"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                className="w-20 sm:w-24 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Макс.."
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                min="0"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-black hover:bg-gray-800 rounded transition-colors duration-200"
            >
              Застосувати
            </button>
          </form>
        </div>

        {/* Категорії, Бренди, Теги */}
        {data?.categories &&
          renderFilterSection("Категорії", "categories", data.categories)}
        {data?.brands && renderFilterSection("Бренди", "brands", data.brands)}
        {data?.tags && renderFilterSection("Теги", "tags", data.tags)}

        {/* Кольори */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-gray-800">Кольори</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {data?.colors?.map((option) => (
              <label
                key={option.id}
                className="flex items-center justify-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.colors?.includes(option.id) || false}
                  onChange={(e) =>
                    handleCheckboxChange("colors", option.id, e.target.checked)
                  }
                />
                <span
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    filters.colors?.includes(option.id)
                      ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: option.hex_code }}
                ></span>
              </label>
            ))}
          </div>
        </div>

        {/* Розміри */}
        <div className="mb-6">
          <h3 className="font-medium mb-3 text-gray-800">Розміри</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {data?.sizes?.map((option) => (
              <label key={option.id} className="cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.sizes?.includes(option.id) || false}
                  onChange={(e) =>
                    handleCheckboxChange("sizes", option.id, e.target.checked)
                  }
                />
                <span
                  className={`flex items-center justify-center w-full h-12 border-2 rounded-lg transition-all duration-200 text-center ${
                    filters.sizes?.includes(option.id)
                      ? "bg-blue-100 border-blue-500 text-blue-700"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <span className="text-sm font-medium truncate px-1">
                    {option.size}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Кнопка скидання */}
        <button
          type="button"
          className="w-full px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
          onClick={resetFilters}
        >
          Скинути фільтрацію
        </button>
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Фільтри
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {isFilterOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}

      {/* Mobile Filter Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-screen w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">Фільтри</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
            aria-label="Close filters"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto h-full pb-20 p-6">
          {/* Пошук */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-800">Пошук</h3>
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Пошук продуктів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-3 text-white bg-black hover:bg-gray-800 rounded-r-md transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Ціна */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-800">Ціна</h3>
            <form onSubmit={handlePriceSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  className="w-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Мін.."
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  min="0"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  className="w-20 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Макс.."
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  min="0"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-black hover:bg-gray-800 rounded transition-colors duration-200"
              >
                Застосувати
              </button>
            </form>
          </div>

          {/* Категорії, Бренди, Теги з адаптивними колонками */}
          {data?.categories && (
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-800">Категорії</h3>
              <div className="grid grid-cols-1 gap-2">
                {data.categories.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 flex-shrink-0"
                      checked={filters.categories?.includes(option.id) || false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "categories",
                          option.id,
                          e.target.checked,
                        )
                      }
                    />
                    <span className="text-sm">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {data?.brands && (
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-800">Бренди</h3>
              <div className="grid grid-cols-1 gap-2">
                {data.brands.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 flex-shrink-0"
                      checked={filters.brands?.includes(option.id) || false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "brands",
                          option.id,
                          e.target.checked,
                        )
                      }
                    />
                    <span className="text-sm">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {data?.tags && (
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-800">Теги</h3>
              <div className="grid grid-cols-1 gap-2">
                {data.tags.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
                  >
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 flex-shrink-0"
                      checked={filters.tags?.includes(option.id) || false}
                      onChange={(e) =>
                        handleCheckboxChange(
                          "tags",
                          option.id,
                          e.target.checked,
                        )
                      }
                    />
                    <span className="text-sm">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Кольори */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-800">Кольори</h3>
            <div className="grid grid-cols-6 gap-3">
              {data?.colors?.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center justify-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filters.colors?.includes(option.id) || false}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "colors",
                        option.id,
                        e.target.checked,
                      )
                    }
                  />
                  <span
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      filters.colors?.includes(option.id)
                        ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: option.hex_code }}
                  ></span>
                </label>
              ))}
            </div>
          </div>

          {/* Розміри */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-gray-800">Розміри</h3>
            <div className="grid grid-cols-4 gap-2">
              {data?.sizes?.map((option) => (
                <label key={option.id} className="cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filters.sizes?.includes(option.id) || false}
                    onChange={(e) =>
                      handleCheckboxChange("sizes", option.id, e.target.checked)
                    }
                  />
                  <span
                    className={`flex items-center justify-center w-full h-12 border-2 rounded-lg transition-all duration-200 text-center ${
                      filters.sizes?.includes(option.id)
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <span className="text-sm font-medium truncate px-1">
                      {option.size}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Кнопка скидання */}
          <button
            type="button"
            className="w-full px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
            onClick={resetFilters}
          >
            Скинути фільтрацію
          </button>
        </div>
      </div>
    </>
  );
};
