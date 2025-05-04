import React, { useState, useEffect } from "react";
import { useProductFilters } from "../hooks/useFilterParams";
import { useFilter } from "../hooks/useFilter";

export const Filter: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useProductFilters();
  const { data, isLoading } = useFilter(true);
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || "",
    max: filters.maxPrice || "",
  });
  const [searchQuery, setSearchQuery] = useState(filters.search || "");

  useEffect(() => {
    setPriceRange({
      min: filters.minPrice || "",
      max: filters.maxPrice || "",
    });
    setSearchQuery(filters.search || "");
  }, [filters.minPrice, filters.maxPrice, filters.search]);

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

  if (isLoading) return <div>Завантаження фільтрації...</div>;
  const renderFilterSection = (
    title: string,
    type: "categories" | "brands" | "tags",
    options: Array<{ id: number; name: string }>,
  ) => (
    <div className="mb-4">
      <h3 className="font-medium mb-2">{title}</h3>
      <div className="flex flex-col gap-2">
        {options?.map((option) => (
          <label key={option.id} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters[type]?.includes(option.id) || false}
              onChange={(e) =>
                handleCheckboxChange(type, option.id, e.target.checked)
              }
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="filter-container p-4 border rounded">
      <div className="mb-4">
        <h3 className="font-medium mb-2">Пошук</h3>
        <form onSubmit={handleSearchSubmit} className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l"
            placeholder="Пошук продуктів..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-4 text-white bg-black  rounded-r "
          >
            Пошук
          </button>
        </form>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Ціна</h3>
        <form onSubmit={handlePriceSubmit} className="flex flex-wrap gap-2">
          <input
            type="number"
            className="w-24 p-2 border rounded"
            placeholder="Мін.."
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: e.target.value })
            }
            min="0"
          />
          <span className="self-center">-</span>
          <input
            type="number"
            className="w-24 p-2 border rounded"
            placeholder="Макс.."
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: e.target.value })
            }
            min="0"
          />
          <button
            type="submit"
            className="px-6 py-4 text-white bg-black  rounded"
          >
            Застосувати
          </button>
        </form>
      </div>
      {data?.categories &&
        renderFilterSection("Categories", "categories", data.categories)}
      {data?.brands && renderFilterSection("Brands", "brands", data.brands)}
      {data?.tags && renderFilterSection("Tags", "tags", data.tags)}

      <div className="mb-4">
        <h3 className="font-medium mb-2">Кольори</h3>
        <div className="flex flex-wrap gap-2">
          {data?.colors?.map((option) => (
            <label key={option.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.colors?.includes(option.id) || false}
                onChange={(e) =>
                  handleCheckboxChange("colors", option.id, e.target.checked)
                }
              />
              <span
                className={`w-6 h-6 rounded-full mr-2 border ${
                  filters.colors?.includes(option.id)
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
                style={{ backgroundColor: option.hex_code }}
              ></span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium mb-2">Розміри</h3>
        <div className="flex flex-wrap gap-2">
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
                className={`inline-flex items-center justify-center w-10 h-10 border rounded-md ${
                  filters.sizes?.includes(option.id)
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {option.size}
              </span>
            </label>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="px-6 py-4 text-white bg-black rounded-md hover:bg-gray-300"
        onClick={resetFilters}
      >
        Скинути фільтрацію
      </button>
    </div>
  );
};
