export const SkeletonProductPageLoader = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* фультрація% */}
      <div className="w-[27%] bg-white p-6 border-r border-gray-200">
        {/* пошук */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded mb-3 w-16 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* ціна*/}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded mb-3 w-12 animate-pulse"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
            <div className="h-10 bg-gray-800 rounded w-24 animate-pulse"></div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded mb-3 w-20 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* бренди */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded mb-3 w-16 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* теги */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded mb-3 w-12 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* кольори */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded mb-3 w-16 animate-pulse"></div>
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        {/* розмір */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded mb-3 w-16 animate-pulse"></div>
          <div className="flex space-x-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="w-12 h-8 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        <div className="h-12 bg-red-200 rounded animate-pulse"></div>
      </div>

      <div className="w-[73%] p-2 sm:p-4">
        {/* продукти - максимум 4 колонки як в новому компоненті */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 animate-pulse relative">
                <div className="absolute top-2 right-2 w-12 h-6 bg-red-200 rounded animate-pulse"></div>
                <div className="absolute top-2 left-2 flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="w-3 h-3 bg-yellow-200 rounded-sm animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              {/* інформація продукту */}
              <div className="p-4">
                {/* Brand */}
                <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>

                {/*назва продукту*/}
                <div className="h-4 bg-gray-300 rounded w-full mb-3 animate-pulse"></div>

                {/* ціна продукту */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="h-5 bg-red-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>

                {/* Sold Count */}
                <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <div className="h-12 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
