import React, { useState } from "react";

interface TabsProps {
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  categories,
  activeCategory = categories[0],
  onCategoryChange,
}) => {
  const [selected, setSelected] = useState(activeCategory);

  const handleTabClick = (category: string) => {
    setSelected(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div>
      <div className="flex  mb-8 mx-auto w-[80%]  justify-between">
        {categories.map((category) => (
          <button
            key={category}
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap ${
              category === selected
                ? "bg-black text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => handleTabClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div> {selected}</div>
    </div>
  );
};
