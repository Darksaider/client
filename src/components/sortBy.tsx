import { useProductFilters } from "../hooks/useFilterParams";
import { SORT_BY_OPTIONS } from "../store/constants";

export const SortBy = () => {
  const { filters, updateFilters } = useProductFilters();
  return (
    <div className="flex items-center justify-between m-4">
      <div className="text-gray-700 font-medium">Сортувати за:</div>
      <select
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue="newest"
        onChange={(e) =>
          updateFilters({ sortBy: e.target.value as typeof filters.sortBy })
        }
      >
        {SORT_BY_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
